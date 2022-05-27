
import { $ } from "./utils.js";

import "./customElements.js";

import { startRendering } from "./main.js";

let /** @type {ShadowRoot} */ filesShadow;

const getFolder = async (/** @type {string} */ folderId) => {
	const transaction = database.transaction("folders", "readwrite");
	const foldersStore = transaction.objectStore("folders");
	const request = foldersStore.get(folderId);
	await new Promise((resolve) => request.onsuccess = resolve);
	return request.result;
};

const itemClickHandler = (/** @type {string} */ type) => async function (/** @type {MouseEvent} */ event) {
	if (event.ctrlKey || event.shiftKey || event.metaKey) return;
	event.preventDefault();
	switch (type) {
		case ("folder"): {
			currentFolderId = this.dataset.id;
			history.pushState({ folderId: currentFolderId }, "");
			await displayFolder(currentFolderId);
			break;
		};

		case ("file"): {
			const file = await (async () => {
				const transaction = database.transaction("files", "readonly");
				const filesStore = transaction.objectStore("files");
				const request = filesStore.get(this.dataset.id);
				await new Promise((resolve) => request.onsuccess = resolve);
				return request.result;
			})();

			filesView = false;
			$("c-my-files").replaceWith(document.createElement("c-math"));
			;/** @type {HTMLTextAreaElement} */ ($(".text-input", $("c-math").shadowRoot)).value = file.content;
			history.pushState({ fileId: file.id }, "");
			startRendering();
			break;
		};
	}
};

const displayFolder = async (/** @type {string} */ folderId) => {

	const foldersUL = $("ul.folders", filesShadow);
	const filesUL = $("ul.files", filesShadow);

	const { folders, files, path, name: folderName } = await getFolder(folderId);

	for (const [items, UL, type] of [[folders, foldersUL, "folder"], [files, filesUL, "file"]]) {

		for (const item of [...UL.children].filter(({ classList }) => classList.contains("item"))) item.remove();

		const template = /** @type {HTMLTemplateElement} */ ($(":scope > template", UL));

		for (const item of [...items].reverse()) {
			const clone = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
			$(".name", clone).textContent = item.name;
			$("[data-id]", clone).dataset.id = item.id;
			$("a", clone).setAttribute("href", `?${type}=${item.id}`);
			$("a", clone).addEventListener("click", itemClickHandler(type));
			UL.insertAdjacentElement("afterbegin", clone.firstElementChild);
		}
	}

	{
		const folderPath = await Promise.all(path.map(async ({ id }) => {
			const transaction = database.transaction("folders", "readonly");
			const filesStore = transaction.objectStore("folders");
			const request = filesStore.get(id);
			await new Promise((resolve) => request.onsuccess = resolve);
			return {
				id,
				name: request.result.name,
			};
		}));

		const breadcrumbUL = $("nav.breadcrumb ul", filesShadow);
		const template = /** @type {HTMLTemplateElement} */ ($(":scope > template", breadcrumbUL));

		for (const child of [...breadcrumbUL.children].filter(({ tagName }) => tagName !== "TEMPLATE")) child.remove();

		for (const folder of [...folderPath, { name: folderName, id: folderId }]) {
			const clone = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
			$(".name", clone).textContent = folder.name;
			$("a", clone).setAttribute("href", `?folder=${folder.id}`);
			$("a", clone).addEventListener("click", itemClickHandler("folder"));
			$("[data-id]", clone).dataset.id = folder.id;
			breadcrumbUL.appendChild(clone);
		}
	}
};


const database = await (async () => {
	const request = window.indexedDB.open(new URL(document.baseURI).pathname, 1);

	request.addEventListener("upgradeneeded", async () => {
		const folderStore = request.result.createObjectStore("folders", { keyPath: "id" });
		const fileStore = request.result.createObjectStore("files", { keyPath: "id" });

		folderStore.put({
			id: "root",
			name: "home",
			path: [],
			folders: [
				{
					id: "11111111-1111-1111-1111-111111111111",
					name: "1111",
				},
				{
					id: "22222222-2222-2222-2222-222222222222",
					name: "2222",
				},
			],
			files: [
				{
					id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
					name: "aaaa",
				},
				{
					id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
					name: "bbbb",
				},
				{
					id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
					name: "cccc",
				},
			],
		});

		folderStore.put({
			id: "11111111-1111-1111-1111-111111111111",
			name: "1111",
			path: [
				{
					id: "root",
				},
			],
			folders: [
				{
					id: "33333333-3333-3333-3333-333333333333",
					name: "3333",
				}
			],
			files: [
				{
					id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
					name: "dddd",
				},
				{
					id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
					name: "eeee",
				},
			],
		});

		folderStore.put({
			id: "22222222-2222-2222-2222-222222222222",
			name: "2222",
			path: [
				{
					id: "root",
				},
			],
			folders: [],
			files: [
				{
					id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
					name: "ffff",
				},
			],
		});

		folderStore.put({
			id: "33333333-3333-3333-3333-333333333333",
			name: "3333",
			path: [
				{
					id: "root",
				},
				{
					id: "11111111-1111-1111-1111-111111111111",
				},
			],
			folders: [],
			files: [
				{
					id: "gggggggg-gggg-gggg-gggg-gggggggggggg",
					name: "gggg",
				},
			],
		});

		fileStore.put({
			id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
			name: "aaaa",
			content: "aaaa",
		});

		fileStore.put({
			id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
			name: "bbbb",
			content: "bbbb",
		});

		fileStore.put({
			id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
			name: "cccc",
			content: "cccc",
		});

		fileStore.put({
			id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
			name: "dddd",
			content: "dddd",
		});

		fileStore.put({
			id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
			name: "eeee",
			content: "eeee",
		});

		fileStore.put({
			id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
			name: "ffff",
			content: "ffff",
		});

		fileStore.put({
			id: "gggggggg-gggg-gggg-gggg-gggggggggggg",
			name: "gggg",
			content: "gggg",
		});
	});

	await new Promise((resolve) => request.onsuccess = resolve);

	return request.result;
})();


let filesView = true;

let currentFolderId = "root";

{
	const searchParams = new URLSearchParams(location.search);
	if (searchParams.get("folder")) {
		history.replaceState({ folderId: searchParams.get("folder") }, "", location.pathname);
	} else if (searchParams.get("file")) {
		history.replaceState({ fileId: searchParams.get("file") }, "", location.pathname);
	}
}

$(".my-files", $("c-header").shadowRoot)?.addEventListener("click", async () => {
	filesView = !filesView;
	if (filesView) {
		$("c-math").replaceWith(document.createElement("c-my-files"));

		filesShadow = $("c-my-files").shadowRoot;

		await displayFolder(currentFolderId);

	} else {
		$("c-my-files").replaceWith(document.createElement("c-math"));
	}
});

window.addEventListener("popstate", async (event) => {
	if (event.state?.fileId) {
		if (filesView) {
			filesView = false;
			$("c-my-files").replaceWith(document.createElement("c-math"));
		}
		const file = await (async () => {
			const transaction = database.transaction("files", "readonly");
			const filesStore = transaction.objectStore("files");
			const request = filesStore.get(history.state?.fileId);
			await new Promise((resolve) => request.onsuccess = resolve);
			return request.result;
		})();
		;/** @type {HTMLTextAreaElement} */ ($(".text-input", $("c-math").shadowRoot)).value = file.content;
		startRendering();
	} else if (event.state?.folderId) {
		if (!filesView) {
			filesView = true;
			$("c-math").replaceWith(document.createElement("c-my-files"));
			filesShadow = $("c-my-files").shadowRoot;
		}
		currentFolderId = event.state?.folderId;
		console.log(currentFolderId);
		await displayFolder(currentFolderId);
	}
});

(async () => {
	if (history.state?.fileId) {
		const file = await (async () => {
			const transaction = database.transaction("files", "readonly");
			const filesStore = transaction.objectStore("files");
			const request = filesStore.get(history.state?.fileId);
			await new Promise((resolve) => request.onsuccess = resolve);
			return request.result;
		})();
		$("c-my-files").replaceWith(document.createElement("c-math"));
		filesView = false;
		;/** @type {HTMLTextAreaElement} */ ($(".text-input", $("c-math").shadowRoot)).value = file.content;
		startRendering();

	} else {
		filesView = true;
		currentFolderId = history.state?.folderId ?? "root";
		filesShadow = $("c-my-files").shadowRoot;
		await displayFolder(currentFolderId);
	}
})();
