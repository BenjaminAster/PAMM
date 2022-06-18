
import { $, appMeta, database, fileSystemAccessSupported, isApple, mathmlSupported, trace } from "./utils.js";
import "./app.js";
import { startRendering } from "./main.js";

const shadows = new class {
	get files() { return $("c-files").shadowRoot };
	get math() { return $("c-math").shadowRoot };
	get header() { return $("c-header").shadowRoot };
};

const elements = new class {
	get textInput() { return /** @type {HTMLTextAreaElement} */ ($(".text-input", shadows.math)) };
	get myFilesButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=my-files]", shadows.header)) };
	get saveButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=save]", shadows.header)) };
	get downloadButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=download]", shadows.header)) };
	get openButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=open]", shadows.header)) };
	get uploadButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=upload]", shadows.header)) };
	get newFolderButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=new-folder]", shadows.files)) };
	get newBrowserFileButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=new-browser-file]", shadows.files)) };
	get newDiskFileButton() { return /** @type {HTMLButtonElement} */ ($("[data-action=new-disk-file]", shadows.files)) };
	get foldersUL() { return /** @type {HTMLUListElement} */ ($(".folders", shadows.files)) };
	get filesUL() { return /** @type {HTMLUListElement} */ ($(".files", shadows.files)) };
	get breadcrumbUL() { return /** @type {HTMLUListElement} */ ($("nav.breadcrumb ul", shadows.files)) };
};

let currentFolder = {
	id: "root",
	name: "home",
	parentFolder: /** @type {{ id: string }} */ (null),
	folders: [],
	files: [],
};

let /** @type {{ storageType: fileStorageType, databaseData?: { id: string, name: string, content: string }, fileHandle?: FileSystemFileHandle }} */ currentFile;

const fileTypesOption = [{
	accept: { [appMeta.mimeType]: [appMeta.fileExtension] },
	description: appMeta.name,
}];

const renderFile = async (/** @type {{ storageType: fileStorageType, id?: string, fileHandle?: FileSystemFileHandle }} */ { storageType, id, fileHandle }) => {
	toggleView({ filesView: false });
	currentFile = { storageType };

	switch (storageType) {
		case ("indexeddb"): {
			currentFile.databaseData = await database.get({ store: "files", id });
			elements.textInput.value = currentFile.databaseData.content;
			break;
		}
		case ("file-system"): {
			currentFile.fileHandle = fileHandle;
			elements.textInput.value = await (await fileHandle.getFile()).text();
			break;
		}
	}

	startRendering();

	elements.textInput.focus();
};


const toggleView = (() => {
	let filesView = true;

	return (/** @type {{ filesView?: boolean }} */ { filesView: newFilesView = !filesView } = {}) => {
		if (newFilesView !== filesView) {
			filesView = newFilesView;
			$("c-header").dataset.view = filesView ? "files" : "math";
			if (filesView) {
				const element = document.createElement("c-files");
				$("c-math").replaceWith(element);
				initButtonListeners();
			} else {
				const element = document.createElement("c-math");
				$("c-files").replaceWith(element);
			}
		}
		return { filesView };
	}
})();


const itemClickHandler = (/** @type {{ type: itemType, id: string, changeURL?: boolean }} */ { type, id, changeURL = false }) => async (/** @type {MouseEvent?} */ event) => {
	if (event.ctrlKey || event.shiftKey) return;
	event?.preventDefault();

	switch (type) {
		case ("folder"): {
			currentFolder.id = id;
			history.pushState({ folderId: currentFolder.id }, "", changeURL ? `?folder=${id}` : "./");
			await displayFolder({ id: currentFolder.id });
			break;
		}
		case ("file"): {
			history.pushState({ fileId: id }, "", changeURL ? `?file=${id}` : "./");
			await renderFile({ storageType: "indexeddb", id });
			break;
		}
	}
};

const displayFolder = async (/** @type {{ id: string }} */ { id }) => {

	let { folders, files, parentFolder, name: folderName } = currentFolder = await database.get({ store: "folders", id });

	[folders, files] = await Promise.all([[folders, "folders"], [files, "files"]].map(
		async ([items, store]) => await Promise.all(items.map(async ({ id }) => await database.get({ store, id })))
	));

	for (const [items, UL, type, store] of [[folders, elements.foldersUL, "folder", "folders"], [files, elements.filesUL, "file", "files"]]) {

		for (const item of [...UL.children].filter(({ classList }) => classList.contains("item"))) item.remove();

		const template = /** @type {HTMLTemplateElement} */ ($(":scope > template", UL));

		for (const item of items) {
			const /** @type {HTMLElement} */ clone = /** @type {any} */ (template.content.cloneNode(true)).firstElementChild;
			$(".name", clone).textContent = item.name;
			// @ts-ignore
			$("a", clone).href = $("[data-action=permalink]", clone).href = `?${type}=${item.id}`;
			$("a", clone).addEventListener("click", itemClickHandler({ type, id: item.id }));
			$("[data-action=rename]", clone).addEventListener("click", async () => {
				await 0;
				const newName = window.prompt(`Rename ${type}`, item.name)?.trim(); // TODO: use a selfmade dialog
				if (!newName) return;
				item.name = newName;
				$(".name", clone).textContent = item.name;
				await database.put({ store, data: item });
			});
			$("[data-action=delete]", clone).addEventListener("click", async () => {
				await 0;
				if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return; // TODO: use a selfmade dialog
				clone.remove();
				switch (type) {
					case ("folder"): {
						const recursiveDelete = async (/** @type {{ id: string }} */ { id: folderId }) => {
							const { folders, files } = await database.get({ store: "folders", id: folderId });
							await Promise.all([
								folders.map(async ({ id }) => await recursiveDelete({ id })),
								files.map(async ({ id }) => await database.delete({ store: "files", id })),
								database.delete({ store: "folders", id: folderId }),
							]);
						};
						await recursiveDelete({ id: item.id });
						currentFolder.folders = currentFolder.folders.filter(({ id }) => id !== item.id);
						await database.put({ store: "folders", data: currentFolder });
						await database.delete({ store: "folders", id: item.id });
						break;
					}
					case ("file"): {
						currentFolder.files = currentFolder.files.filter(({ id }) => id !== item.id);
						await database.put({ store: "folders", data: currentFolder });
						await database.delete({ store: "files", id: item.id });
						break;
					}
				}
			});
			if (type === "file") {
				$("[data-action=download", clone).addEventListener("click", async () => {
					const { content } = await database.get({ store: "files", id: item.id });
					fileUtils.downloadFile({ name: item.name + appMeta.fileExtension, content });
				});
			}
			$("[data-action=permalink]", clone).addEventListener("click", itemClickHandler({ type, id: item.id, changeURL: true }));
			UL.insertBefore(clone, $(":scope > :not(.item)", UL));
		}
	}

	{
		const breadcrumbUL = elements.breadcrumbUL;
		const template = /** @type {HTMLTemplateElement} */ ($(":scope > template", breadcrumbUL));

		for (const child of [...breadcrumbUL.childNodes].filter(({ nodeName }) => nodeName !== "TEMPLATE")) child.remove();

		const fragment = new DocumentFragment();
		let folder = currentFolder;

		do {
			const clone = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
			$(".name", clone).textContent = folder.name;
			$("a", clone).setAttribute("href", `?folder=${folder.id}`);
			$("a", clone).addEventListener("click", itemClickHandler({ type: "folder", id: folder.id }));
			fragment.insertBefore(clone.firstElementChild, fragment.firstElementChild);
		} while (folder.parentFolder && (folder = await database.get({ store: "folders", id: folder.parentFolder.id })));

		breadcrumbUL.appendChild(fragment);
	}
};

{
	const searchParams = new URLSearchParams(location.search);
	if (searchParams.get("folder")) {
		history.replaceState({ folderId: searchParams.get("folder") }, "", location.pathname);
	} else if (searchParams.get("file")) {
		history.replaceState({ fileId: searchParams.get("file") }, "", location.pathname);
	}
}

elements.myFilesButton.addEventListener("click", async () => {
	if (toggleView().filesView) {
		history.pushState({ folderId: currentFolder.id }, "", "./");
		await displayFolder({ id: currentFolder.id });
	}
});

export let /** @type {(event: KeyboardEvent) => void} */ keyDown;
export let /** @type {() => void} */ initButtonListeners;

const fileUtils = new class {
	async saveFile() {
		switch (currentFile.storageType) {
			case ("indexeddb"): {
				currentFile.databaseData.content = elements.textInput.value;
				await database.put({ store: "files", data: currentFile.databaseData });
				break;
			}
			case ("file-system"): {
				const writable = await currentFile.fileHandle.createWritable().catch(trace);
				if (!writable) return;
				await writable.write(elements.textInput.value);
				await writable.close();
				break;
			}
		}
	};
	downloadFile(/** @type {{ name?: string, content?: string }} */ { name, content } = {}) {
		const anchor = document.createElement("a");
		anchor.href = "data:text/pretty-awesome-math-markup;charset=utf-8," + window.encodeURIComponent(content ?? elements.textInput.value);
		anchor.download = name ?? currentFile.fileHandle?.name ?? (currentFile.databaseData?.name + appMeta.fileExtension);
		anchor.click();
	};
	async openFile() {
		if (fileSystemAccessSupported) {
			let fileHandle = (await window.showOpenFilePicker({ types: fileTypesOption }).catch(trace))?.[0];
			if (!fileHandle) return;
			history.pushState({ fileHandle }, "", "./");
			await renderFile({ storageType: "file-system", fileHandle });
		} else {
			// TODO: use a selfmade dialog:
			window.alert(
				'Your browser does not support interacting with local files ("File System Access API"). '
				+ 'Please use a Chromium-based browser like Google Chrome or Microsoft Edge.'
			);
		}
	};
	async uploadFile() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = appMeta.fileExtension;
		input.click();
		await new Promise((resolve) => input.oninput = resolve);
		const file = input.files?.[0];
		if (!file) return;
		const content = await file?.text();
		const name = file.name.replace(/\.[^.]+$/, "");
		await this.newBrowserFile({ name, content });
	};
	async newFolder(/** @type {{ name: string }} */ { name }) {
		if (!name) return;
		const { id } = await database.add({
			store: "folders",
			data: {
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
		const { databaseData: { id } } = currentFile = {
			storageType: "indexeddb",
			databaseData: await database.add({
				store: "files",
				data: { name, content },
			}),
		};
		currentFolder.files.push({ id });
		await database.put({ store: "folders", data: currentFolder });
		history.pushState({ fileId: id }, "", "./");
		await renderFile({ storageType: "indexeddb", id });
	};
	async newDiskFile() {
		if (fileSystemAccessSupported) {
			let fileHandle = await window.showSaveFilePicker({ types: fileTypesOption }).catch(trace);
			if (!fileHandle) return;
			history.pushState({ fileHandle }, "", "./");
			await renderFile({ storageType: "file-system", fileHandle });
		} else {
			// TODO: use a selfmade dialog:
			window.alert(
				'Your browser does not support interacting with local files ("File System Access API"). '
				+ 'Please use a Chromium-based browser like Google Chrome or Microsoft Edge.'
			);
		}
	};
};

{
	elements.saveButton.addEventListener("click", () => fileUtils.saveFile());
	elements.downloadButton.addEventListener("click", () => fileUtils.downloadFile());

	elements.openButton.addEventListener("click", () => fileUtils.openFile());
	elements.uploadButton.addEventListener("click", () => fileUtils.uploadFile());

	initButtonListeners = () => {
		elements.newFolderButton.addEventListener("click", async () => {
			await 0;
			const name = window.prompt("Folder name:")?.trim(); // TODO: use a selfmade dialog
			await fileUtils.newFolder({ name });
		});

		elements.newBrowserFileButton.addEventListener("click", async () => {
			await 0;
			const name = window.prompt("File name:")?.trim(); // TODO: use a selfmade dialog
			await fileUtils.newBrowserFile({ name });
		});

		elements.newDiskFileButton.addEventListener("click", async () => {
			await 0;
			await fileUtils.newDiskFile();
		});
	};

	initButtonListeners();

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
			await new Promise((resolve) => setTimeout(resolve));
			const file = await fileHandle?.getFile();
			if (!file?.name.endsWith(appMeta.fileExtension)) return;
			history.replaceState({ fileHandle: true }, "");
			await renderFile({ storageType: "file-system", fileHandle });
		});
	}
}

window.addEventListener("popstate", async (event) => {
	if (event.state?.fileId) {
		renderFile({ storageType: "indexeddb", id: event.state.fileId });
	} else if (event.state?.folderId) {
		toggleView({ filesView: true });
		currentFolder.id = event.state?.folderId;
		await displayFolder({ id: currentFolder.id });
	}
});

(async () => {
	if (history.state?.fileId) {
		await renderFile({ storageType: "indexeddb", id: history.state.fileId });
	} else {
		if (!(currentFolder.id = history.state?.folderId)) {
			currentFolder.id = "root";
			history.replaceState({ folderId: currentFolder.id }, "");
		}
		toggleView({ filesView: true });
		await displayFolder({ id: currentFolder.id });
	}
})();
