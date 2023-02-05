
/// <reference types="better-typescript" />
/// <reference path="./global.d.ts" />

import { $, $$, database, fileSystemAccessSupported, isApple, alert, confirm, prompt, setTitle, transition, elements, appMeta, encodeFile, decodeFile, storage } from "./app.js";
import { startRendering } from "./main.js";
import parseDocument from "./parse/document/parseDocument.js";
import renderDocument from "./render/document/renderDocument.js";

const /** @type {any} */ trace = (/** @type {any[]} */ ...args) => console.trace(...args);

let currentFolder = {
	id: "home",
	name: "home",
	parentFolder: /** @type {{ id: string }} */ (null),
	folders: [],
	files: [],
};

let /** @type {{ storageType: FileStorageType, id: string, name: string, content: string, fileHandle?: FileSystemFileHandle }} */ currentFile;

const fileTypesOption = [{
	accept: { [appMeta.mimeType]: [appMeta.fileExtension] },
	description: appMeta.name,
}];

const fileSystemAccessAPINotSupportedMessage = "Your browser does not support interacting with local files (File System Access API). "
	+ "Please use a Chromium-based browser like Google Chrome or Microsoft Edge.";

const addToRecentlyOpened = async (/** @type {{ id: string, storageType: FileStorageType }} */ { id, storageType }) => {
	const recentlyOpenedFils = (await database.get({ store: "key-value", key: "recently-opened" })).value;
	await database.put({
		store: "key-value",
		data: {
			key: "recently-opened",
			value: [{ id, storageType }, ...recentlyOpenedFils.filter(({ id: fileId }) => fileId !== id)],
		},
	});
}

const renderFile = async (/** @type {{ storageType: FileStorageType, id?: string, fileHandle?: FileSystemFileHandle }} */ { storageType, id, fileHandle }) => {
	await toggleView({ filesView: false });

	switch (storageType) {
		case ("indexeddb"): {
			currentFile = {
				storageType,
				...await database.get({ store: "files", key: id }),
			};
			elements.textInput.value = currentFile.content;
			setTitle(`${currentFile.name} 📄`);
			elements.fileNameInput.value = currentFile.name;
			await addToRecentlyOpened({ id, storageType });
			startRendering();
			elements.textInput.focus();
			window.requestAnimationFrame(async () => (await 0, elements.textInput.scrollTo({ top: 0 })));
			return;
		} case ("file-system"): {
			// @ts-ignore
			currentFile ??= {};
			const name = fileHandle.name.replace(/\.[^.]+$/, "");
			if (await fileHandle.queryPermission({ mode: "read" }) !== "granted") {
				if (!(await confirm({
					message: `Do you want to edit ${fileHandle.name}?\nYour browser will prompt you for permission to access ${fileHandle.name}.`,
					userGestureCallback: async () => await fileHandle.requestPermission({ mode: "readwrite" }),
				})).accepted || await fileHandle.queryPermission({ mode: "read" }) !== "granted") {
					await toggleView({ filesView: true });
					await displayFolder({ id: "home" });
					history.pushState({ folderId: "home" }, "", "./");
					return {};
				};
			}
			setTitle(`${name + appMeta.fileExtension} 📄`);
			elements.fileNameInput.value = name;
			const fileContent = await (async () => {
				try {
					return await (await fileHandle.getFile()).text();
				} catch {
					await alert({ message: `The file ${fileHandle.name} could not be opened. It may have been moved or renamed.` });
					await toggleView({ filesView: true });
					await displayFolder({ id: "home" });
					history.pushState({ folderId: "home" }, "", "./");
				}
			})();
			if (!fileContent) return {};
			const { data, text } = decodeFile({ fileContent });
			elements.textInput.value = text;
			startRendering();
			elements.textInput.focus();
			window.requestAnimationFrame(async () => (await 0, elements.textInput.scrollTo({ top: 0 })));
			$ifNotId: if (!id) {
				for (const { fileHandle: itemFileHandle, id: itemId } of await database.getAll({ store: "file-handles" })) {
					if (await fileHandle.isSameEntry(itemFileHandle)) {
						id = itemId;
						break $ifNotId;
					}
				}
				({ id } = await database.add({
					store: "file-handles",
					data: {
						name,
						fileHandle,
						id: `f-${crypto.randomUUID()}`,
					},
				}));
			}
			currentFile = {
				storageType,
				fileHandle,
				name,
				id,
				content: text,
			};
			await addToRecentlyOpened({ id, storageType });
			return {
				...data,
				id,
				name,
			};
		}
	}
};


const toggleView = (() => {
	let filesView = true;
	// const files = document.querySelector("c-files");
	// const editor = document.createElement("c-editor");

	return async (/** @type {{ filesView?: boolean }?} */ { filesView: newFilesView = !filesView } = {}) => {
		if (newFilesView !== filesView) {
			filesView = newFilesView;
			await transition(() => {
				document.documentElement.dataset.view = filesView ? "files" : "editor";
				if (filesView) {
					// const element = document.createElement("c-files");
					// $("c-editor").replaceWith(element);
					for (const section of $$(".html-output > .section", elements.editor)) {
						section.remove();
					}
					elements.editor.replaceWith(elements.files);
					// initButtonListeners();
				} else {
					// const element = document.createElement("c-editor");
					// $("c-files").replaceWith(element);
					elements.files.replaceWith(elements.editor);
					elements.myFilesLink.href = `?folder=${currentFolder.id}`;
				}
			});
		}
		return { filesView };
	}
})();


const itemClickHandler = (/** @type {{ type: ItemType, storageType?: FileStorageType, fileHandle?: FileSystemFileHandle, id: string, changeURL?: boolean }} */ {
	type, storageType, fileHandle, id, changeURL = false
}) => async (/** @type {MouseEvent?} */ event) => {
	if (event?.ctrlKey || event?.metaKey || event?.shiftKey) return;
	event?.preventDefault();

	switch (type) {
		case ("folder"): {
			currentFolder.id = id;
			await transition(async () => await displayFolder({ id: currentFolder.id }), { resolveWhenFinished: true });
			history.pushState({ folderId: currentFolder.id }, "", changeURL ? `?folder=${id}` : "./");
			break;
		} case ("file"): {
			if (storageType === "indexeddb") {
				await renderFile({ storageType, id });
			} else if (storageType === "file-system") {
				await renderFile({ storageType, fileHandle });
			} else throw new Error(`Unknown storage type (${storageType})`);

			history.pushState({ fileId: id, storageType }, "", changeURL ? `?file=${id}` : "./");
			break;
		}
	}
};


const displayFolder = async (/** @type {{ id: string }} */ { id }) => {

	currentFile = null;

	let { folders, files, parentFolder, name: folderName } = currentFolder = await database.get({ store: "folders", key: id });

	if (id === "home") document.title = appMeta.shortName;
	else setTitle(`${folderName} 📂`);

	[folders, files] = await Promise.all([[folders, "folders"], [files, "files"]].map(
		async ([items, store]) => await Promise.all(items.map(async ({ id }) => await database.get({ store, key: id })))
	));

	if (currentFile) return;

	const onDragStart = (/** @type {{ type: ItemType, id: string }} */ { type, id }) => async (/** @type {DragEvent} */ event) => {
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/plain", JSON.stringify({ type, id }));
	};

	const onDrop = (/** @type {{ folder: any }} */ { folder }) => async (/** @type {DragEvent} */ event) => {
		event.preventDefault();
		event.stopPropagation();
		const data = (() => {
			try {
				return JSON.parse(event.dataTransfer.getData("text/plain") ?? null);
			} catch { }
		})();
		if (!data) return;
		const /** @type {string} */ droppedItemStore = {
			folder: "folders",
			file: "files",
		}[data.type];

		const droppedItem = await database.get({ store: droppedItemStore, key: data.id });
		folder[droppedItemStore].push({ id: droppedItem.id });
		await database.put({ store: "folders", data: folder });

		const droppedItemParentfolder = await database.get({ store: "folders", key: droppedItem.parentFolder.id });
		droppedItemParentfolder[droppedItemStore] = droppedItemParentfolder[droppedItemStore].filter(({ id }) => id !== droppedItem.id);
		await database.put({ store: "folders", data: droppedItemParentfolder });

		droppedItem.parentFolder = { id: folder.id };
		await database.put({ store: droppedItemStore, data: droppedItem });

		await displayFolder({ id: currentFolder.id });
	};

	for (const [items, UL, type, store] of [[folders, elements.foldersUL, "folder", "folders"], [files, elements.filesUL, "file", "files"]]) {

		for (const item of [...UL.children].filter(({ classList }) => classList.contains("item"))) item.remove();

		const template = $(":scope > template", UL);

		for (const item of items) {
			const clone = /** @type {HTMLElement} */ (template.content.cloneNode(true).firstElementChild);
			$(".name", clone).textContent = item.name;
			$("a", clone).href = $("a[data-action=permalink]", clone).href = `?${type}=${item.id}`;
			$("a", clone).addEventListener("click", itemClickHandler({ type, id: item.id, storageType: "indexeddb" }));
			$("a", clone).addEventListener("dragstart", onDragStart({ type, id: item.id }));
			if (type === "folder") {
				clone.addEventListener("dragover", (event) => event.preventDefault());
				clone.addEventListener("drop", onDrop({ folder: item }));
			}
			$("[data-action=rename]", clone).addEventListener("click", async () => {
				const newName = (await prompt({ message: `Rename ${type}`, defaultValue: item.name })).value?.trim();
				if (!newName) return;
				item.name = newName;
				$(".name", clone).textContent = item.name;
				await database.put({ store, data: item });
			});
			$("[data-action=delete]", clone).addEventListener("click", async () => {
				if (!(await confirm({ message: `Are you sure you want to delete ${item.name}?` })).accepted) return;
				clone.remove();
				switch (type) {
					case ("folder"): {
						const recursiveDelete = async (/** @type {{ id: string }} */ { id: folderId }) => {
							const { folders, files } = await database.get({ store: "folders", key: folderId });
							await Promise.all([
								folders.map(async ({ id }) => await recursiveDelete({ id })),
								files.map(async ({ id }) => await database.delete({ store: "files", key: id })),
								database.delete({ store: "folders", key: folderId }),
							]);
						};
						await recursiveDelete({ id: item.id });
						currentFolder.folders = currentFolder.folders.filter(({ id }) => id !== item.id);
						await database.put({ store: "folders", data: currentFolder });
						await database.delete({ store: "folders", key: item.id });
						break;
					} case ("file"): {
						currentFolder.files = currentFolder.files.filter(({ id }) => id !== item.id);
						await database.put({ store: "folders", data: currentFolder });
						await database.delete({ store: "files", key: item.id });
						break;
					}
				}
			});
			if (type === "file") {
				$("[data-action=export]", clone).addEventListener("click", async () => {
					const { content } = await database.get({ store: "files", key: item.id });
					await fileUtils.showExportDialog({ name: item.name, content, renderFileArguments: { storageType: "indexeddb", id: item.id } });
				});
			}
			$("[data-action=permalink]", clone).addEventListener("click", itemClickHandler({ type, id: item.id, storageType: "indexeddb", changeURL: true }));
			UL.insertBefore(clone, $(":scope > :not(.item)", UL));
		}
	}

	{
		const breadcrumbUL = elements.breadcrumbUL;
		const template = $(":scope > template", breadcrumbUL);

		for (const child of [...breadcrumbUL.childNodes].filter(({ nodeName }) => nodeName !== "TEMPLATE")) child.remove();

		const fragment = new DocumentFragment();
		let folder = currentFolder;

		do {
			const clone = /** @type {HTMLElement} */ (template.content.cloneNode(true).firstElementChild);
			$(".name", clone).textContent = folder.name;
			$("a", clone).setAttribute("href", `?folder=${folder.id}`);
			const folderId = folder.id;
			$("a", clone).addEventListener("click", async (event) => {
				document.documentElement.classList.add("transition-reverse");
				await itemClickHandler({ type: "folder", id: folderId })(event);
				document.documentElement.classList.remove("transition-reverse");
			});
			$("a", clone).addEventListener("dragstart", onDragStart({ type: "folder", id: folder.id }));
			clone.addEventListener("dragover", (event) => event.preventDefault());
			clone.addEventListener("drop", onDrop({ folder }));
			fragment.insertBefore(clone, fragment.firstElementChild);
		} while (folder.parentFolder && (folder = await database.get({ store: "folders", key: folder.parentFolder.id })));

		breadcrumbUL.append(fragment);
	}
};

{
	const searchParams = new URLSearchParams(location.search);
	if (searchParams.get("folder")) {
		history.replaceState({ folderId: searchParams.get("folder") }, "", "./");
	} else if (searchParams.get("file")) {
		const fileId = searchParams.get("file");
		let /** @type {FileStorageType} */ storageType;
		if (fileId.startsWith("b-")) storageType = "indexeddb";
		else if (fileId.startsWith("f-")) storageType = "file-system";
		else throw new Error("invalid file id");
		history.replaceState({ fileId, storageType }, "", "./");
	}
}

elements.myFilesLink.addEventListener("click", async (event) => {
	storage.set("my-files-visited", true);
	if (event.shiftKey || event.ctrlKey || event.metaKey) return;
	event.preventDefault();
	if ((await toggleView()).filesView) {
		history.pushState({ folderId: currentFolder.id }, "", "./");
		await displayFolder({ id: currentFolder.id });
	}
});

export let /** @type {(event: KeyboardEvent) => void} */ keyDown;

const fileUtils = new class {
	async saveFile() {
		currentFile.content = elements.textInput.value.normalize();
		switch (currentFile.storageType) {
			case ("indexeddb"): {
				await database.put({
					store: "files",
					data: {
						id: currentFile.id,
						name: currentFile.name,
						content: currentFile.content,
					},
				});
				break;
			} case ("file-system"): {
				const writable = await currentFile.fileHandle.createWritable().catch(trace);
				if (!writable) return;
				await writable.write(encodeFile({ text: currentFile.content }));
				await writable.close();
				break;
			}
		}
		document.documentElement.classList.remove("file-dirty");
	};
	downloadFile(/** @type {{ name?: string, content?: string }?} */ {
		name = currentFile.name + appMeta.fileExtension,
		content = elements.textInput.value.normalize(),
	} = {}) {
		const anchor = document.createElement("a");
		const fileContent = encodeFile({ text: content });
		anchor.href = URL.createObjectURL(new Blob([fileContent], { type: appMeta.mimeType }));
		anchor.download = name;
		anchor.click();
		URL.revokeObjectURL(anchor.href);
	};
	async printFile() {
		await 0;
		window.print();
	};
	async openFile() {
		if (fileSystemAccessSupported) {
			let fileHandle = (await window.showOpenFilePicker({ types: fileTypesOption }).catch(trace))?.[0];
			if (!fileHandle) return;
			const { id } = await renderFile({ storageType: "file-system", fileHandle });
			history.pushState({ fileId: id, storageType: "file-system" }, "", "./");
		} else {
			await alert({
				message: fileSystemAccessAPINotSupportedMessage,
			});
		}
	};
	async uploadFile() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = appMeta.fileExtension;
		input.click();
		await new Promise((resolve) => input.addEventListener("input", resolve, { once: true }));
		const file = input.files?.[0];
		if (!file) return;
		const { text } = decodeFile({ fileContent: await file.text() });
		const name = file.name.replace(/\.[^.]+$/, "");
		await this.newBrowserFile({ name, content: text });
	};
	async newFolder(/** @type {{ name: string }} */ { name }) {
		if (!name) return;
		const { id } = await database.add({
			store: "folders",
			data: {
				id: crypto.randomUUID(),
				name,
				parentFolder: { id: currentFolder.id },
				folders: [],
				files: [],
			},
		});
		currentFolder.folders.push({ id });
		await database.put({ store: "folders", data: currentFolder });
		history.pushState({ folderId: id }, "", "./");
		await displayFolder({ id });
	};
	async newBrowserFile(/** @type {{ name: string, content?: string }} */ { name, content = "" }) {
		if (!name) return;
		const { id } = currentFile = {
			storageType: "indexeddb",
			...await database.add({
				store: "files",
				data: { name, content, id: `b-${crypto.randomUUID()}` },
			}),
		};
		currentFolder.files.push({ id });
		await database.put({ store: "folders", data: currentFolder });
		history.pushState({ fileId: id, storageType: "indexeddb" }, "", "./");
		await renderFile({ storageType: "indexeddb", id });
	};
	async newDiskFile() {
		if (fileSystemAccessSupported) {
			let fileHandle = await window.showSaveFilePicker({ types: fileTypesOption }).catch(trace);
			if (!fileHandle) return;

			const id = `f-${crypto.randomUUID()}`;

			const writable = await fileHandle.createWritable();
			if (!writable) return;
			await writable.write(encodeFile({ text: "" }));
			await writable.close();

			database.add({
				store: "file-handles",
				data: { id, fileHandle, name: fileHandle.name },
			});

			await renderFile({ storageType: "file-system", fileHandle, id });
			history.pushState({ fileId: id, storageType: "file-system" }, "", "./");
		} else {
			await alert({
				message: fileSystemAccessAPINotSupportedMessage,
			});
		}
	};
	async showExportDialog(/** @type {{ name?: string, content?: string, renderFileArguments?: any }?} */ {
		name,
		content,
		renderFileArguments,
	} = {}) {
		const dialog = /** @type {HTMLDialogElement} */ ($("template#export-dialog").content.firstElementChild.cloneNode(true));
		$("button.close", dialog).addEventListener("click", () => dialog.remove());
		$("[data-action=download]", dialog).addEventListener("click", async () => {
			dialog.remove();
			this.downloadFile({ name, content });
		});
		$("[data-action=print]", dialog).addEventListener("click", async () => {
			if (renderFileArguments) {
				await renderFile(renderFileArguments);

				window.addEventListener("afterprint", async () => {
					await 0; // https://crbug.com/1316315
					await toggleView({ filesView: true });
					await displayFolder({ id: currentFolder.id });
				}, { once: true });
			}
			dialog.remove();
			this.printFile();
		});
		$("[data-action=export-html]", dialog).addEventListener("click", async () => {
			dialog.remove();
			const tempDiv = document.createElement("div");
			const tree = parseDocument(content ?? elements.textInput.value.normalize())
			for (const item of tree) {
				tempDiv.append(renderDocument([item]));
				tempDiv.append(document.createTextNode("\n"));
			}
			const anchor = document.createElement("a");
			const html = [
				`<!DOCTYPE html>`,
				`<html lang="en">`,
				`<head>`,
				`<meta charset="UTF-8" />`,
				`<meta name="viewport" content="width=device-width, initial-scale=1" />`,
				`<meta name="color-scheme" content="dark light" />`,
				Object.assign(document.createElement("title"), { textContent: name ?? currentFile.name }).outerHTML,
				`<style>`,
				`body { margin: 0 max(1rem, 50dvi - 30rem); font-family: "Computer Modern", "Noto Serif", ui-serif, serif; }`,
				`@media print { body { margin: 0; } }`,
				`math[display=block] { margin-block: .5rem; }`,
				`code { white-space: pre-wrap; }`,
				`</style>`,
				`</head>`,
				`<body>`,
				``,
				tempDiv.innerHTML,
				`</body>`,
				`</html>`,
			].join("\n");
			anchor.href = URL.createObjectURL(new Blob([html], { type: appMeta.mimeType }));
			anchor.download = (name ?? currentFile.name) + ".html";
			anchor.click();
			URL.revokeObjectURL(anchor.href);
		});
		document.body.append(dialog);
		dialog.showModal();
	};
};

{
	// elements.downloadButton.addEventListener("click", () => fileUtils.downloadFile());
	elements.saveButton.addEventListener("click", async () => await fileUtils.saveFile());
	// elements.printButton.addEventListener("click", async () => await fileUtils.printFile());
	elements.exportButton.addEventListener("click", async () => await fileUtils.showExportDialog())

	elements.openButton.addEventListener("click", async () => await fileUtils.openFile());
	elements.uploadButton.addEventListener("click", async () => await fileUtils.uploadFile());

	elements.recentlyOpenedButton.addEventListener("click", async () => {
		const dialog = elements.recentlyOpenedDialog;
		const closeDialog = () => {
			dialog.close();
			for (const element of $$(":scope > ul > li", dialog)) {
				element.remove();
			}
		};
		const recentlyOpenedFiles = await Promise.all((await database.get({ store: "key-value", key: "recently-opened" })).value.map(async ({ id, storageType }) => {
			const store = {
				"indexeddb": "files",
				"file-system": "file-handles",
			}[storageType];
			if (!store) throw new Error(`Unkown storage type (${storageType})`);
			return {
				...await database.get({ store, key: id }),
				storageType,
			};
		}));
		const UL = $("ul", dialog);
		const listItem = $(":scope > template", UL).content;
		$("button.close", dialog).addEventListener("click", closeDialog, { once: true });
		for (const { id, storageType, name, fileHandle } of recentlyOpenedFiles) {
			const clone = /** @type {DocumentFragment} */ (listItem.cloneNode(true));
			$("[data-storagetype]", clone).dataset.storagetype = storageType;
			$(".name", clone).textContent = name + ((storageType === "file-system") ? appMeta.fileExtension : "");
			$("a.link", clone).href = $("a.permalink", clone).href = `?file=${id}`;
			for (const [selectorString, changeURL] of /** @type {any} */ ([["a.link", false], ["a.permalink", true]])) {
				if (storageType === "indexeddb") {
					$(selectorString, clone).addEventListener("click", (event) => {
						closeDialog();
						itemClickHandler({ id, type: "file", storageType, changeURL })(event);
					});
				} else if (storageType === "file-system") {
					$(selectorString, clone).addEventListener("click", async (event) => {
						if (event.ctrlKey || event.metaKey || event.shiftKey) return;
						event.preventDefault();
						if (await fileHandle.queryPermission({ mode: "read" }) !== "granted") {
							if (await fileHandle.requestPermission({ mode: "readwrite" }) !== "granted") return;
						}
						closeDialog();
						await itemClickHandler({ id, type: "file", storageType, fileHandle, changeURL })();
					});
				} else throw new Error(`Unknown storage type (${storageType})`);
			}
			UL.append(clone);
		}
		dialog.showModal();
	});

	elements.newFolderButton.addEventListener("click", async () => {
		const name = (await prompt({ message: "Folder name:" })).value?.trim();
		await fileUtils.newFolder({ name });
	});

	elements.newBrowserFileButton.addEventListener("click", async () => {
		const name = (await prompt({ message: "File name:" })).value?.trim();
		await fileUtils.newBrowserFile({ name });
	});

	elements.newDiskFileButton.addEventListener("click", async () => {
		await fileUtils.newDiskFile();
	});

	keyDown = (/** @type {KeyboardEvent} */ event) => {
		if (event.ctrlKey === !isApple && event.metaKey === isApple && !event.shiftKey && !event.altKey) {
			if (event.key === "s") {
				event.preventDefault();
				fileUtils.saveFile();
			} else if (event.key === "o") {
				event.preventDefault();
				fileUtils.openFile();
			}
		}
	};

	if (!history.state?.fileId && !history.state?.folderId) {
		window.launchQueue?.setConsumer(async ({ files: [fileHandle] = [] }) => {
			const file = await fileHandle?.getFile();
			if (!file?.name.endsWith(appMeta.fileExtension)) return;
			const { id } = await renderFile({ storageType: "file-system", fileHandle });
			history.replaceState({ fileId: id, storageType: "file-system" }, "", "./");
		});
	}
}

elements.fileNameInput.addEventListener("blur", async function () {
	if (this.value !== currentFile.name) {
		if (currentFile.storageType === "indexeddb") {
			await database.put({
				store: "files",
				data: {
					...await database.get({ store: "files", key: currentFile.id }),
					name: this.value,
				},
			});
		} else if (currentFile.storageType === "file-system" && FileSystemFileHandle.prototype.move) {
			await currentFile.fileHandle.move(this.value + appMeta.fileExtension);
			await database.put({
				store: "file-handles",
				data: {
					id: currentFile.id,
					fileHandle: currentFile.fileHandle,
					name: this.value,
				},
			});
		}
	}
});

window.addEventListener("beforeunload", (event) => {
	if (document.documentElement.classList.contains("file-dirty")) {
		event.returnValue = true;
	}
});

{
	const handleHistoryStateFile = async () => {
		const { storageType, fileId: id } = history.state;
		switch (storageType) {
			case ("indexeddb"): {
				await renderFile({ storageType: "indexeddb", id });
				break;
			} case ("file-system"): {
				const { fileHandle } = await database.get({ store: "file-handles", key: id }) ?? {};
				if (!fileHandle) throw new Error(`No file handle with id ${id} found`);
				await renderFile({ storageType: "file-system", fileHandle, id });
				break;
			} default: {
				throw new Error("Unknown storage type");
			}
		}
	};

	window.addEventListener("popstate", async (event) => {
		if (event.state?.fileId && event.state.storageType) {
			await handleHistoryStateFile();
		} else if (event.state?.folderId) {
			await toggleView({ filesView: true });
			currentFolder.id = event.state?.folderId;
			await displayFolder({ id: currentFolder.id });
		} else {
			throw new Error(`Invalid history state: ${history.state}`);
		}
	});

	(async () => {
		if (history.state?.fileId) {
			await handleHistoryStateFile();
		} else if ((currentFolder.id = history.state?.folderId) || storage.get("my-files-visited")) {
			currentFolder.id ||= "home";
			history.replaceState({ folderId: currentFolder.id }, "");
			await displayFolder({ id: currentFolder.id });
		} else {
			currentFolder.id = "home";
			await renderFile({ storageType: "indexeddb", id: "b-introduction" });
		}

		window.setTimeout(() => {
			document.documentElement.classList.remove("loading");
		}, 500);
	})();
}

