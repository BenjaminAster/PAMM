
export const $ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement} */ (root.querySelector(selector)))
);

export const $$ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]))
);

export const fileSystemAccessSupported = !!(window.showSaveFilePicker && window.showOpenFilePicker);

export const isApple = navigator.userAgentData?.platform ? ["macOS", "iOS"].includes(navigator.userAgentData.platform) : /^(Mac|iP)/.test(navigator.platform);

export const appMeta = {
	name: "Pretty Awesome Math Markup",
	fileExtension: ".pamm",
	mimeType: "text/pretty-awesome-math-markup",
};

export const /** @type {any} */ trace = (/** @type {any[]} */ ...args) => console.trace(...args);

const openRequest = window.indexedDB.open(new URL(document.baseURI).pathname, 1);

openRequest.addEventListener("upgradeneeded", async () => {
	const folderStore = openRequest.result.createObjectStore("folders", { keyPath: "id" });
	const fileStore = openRequest.result.createObjectStore("files", { keyPath: "id" });

	folderStore.add({
		id: "home",
		name: "Home",
		parentFolder: null,
		folders: [
			{ id: "11111111-1111-1111-1111-111111111111" },
			{ id: "22222222-2222-2222-2222-222222222222" },
		],
		files: [
			{ id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
			{ id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
			{ id: "cccccccc-cccc-cccc-cccc-cccccccccccc" },
			...[..."hijklmnopqrstuvwxyz"].map((letter) => ({ id: "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll("$", letter) })),
		],
	});

	folderStore.add({
		id: "11111111-1111-1111-1111-111111111111",
		name: "1111",
		parentFolder: { id: "home" },
		folders: [
			{ id: "33333333-3333-3333-3333-333333333333" }
		],
		files: [
			{ id: "dddddddd-dddd-dddd-dddd-dddddddddddd" },
			{ id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee" },
		],
	});

	folderStore.add({
		id: "22222222-2222-2222-2222-222222222222",
		name: "2222",
		parentFolder: { id: "home" },
		folders: [],
		files: [
			{ id: "ffffffff-ffff-ffff-ffff-ffffffffffff" },
		],
	});

	folderStore.add({
		id: "33333333-3333-3333-3333-333333333333",
		name: "3333",
		parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
		folders: [],
		files: [
			{ id: "gggggggg-gggg-gggg-gggg-gggggggggggg" },
		],
	});

	fileStore.add({
		id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		name: "aaaa",
		content: "aaaa",
		parentFolder: { id: "home" },
	});

	fileStore.add({
		id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
		name: "bbbb",
		content: "bbbb",
		parentFolder: { id: "home" },
	});

	fileStore.add({
		id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
		name: "cccc",
		content: "cccc",
		parentFolder: { id: "home" },
	});

	fileStore.add({
		id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
		name: "dddd",
		content: "dddd",
		parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
	});

	fileStore.add({
		id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
		name: "eeee",
		content: "eeee",
		parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
	});

	fileStore.add({
		id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
		name: "ffff",
		content: "ffff",
		parentFolder: { id: "22222222-2222-2222-2222-222222222222" },
	});

	fileStore.add({
		id: "gggggggg-gggg-gggg-gggg-gggggggggggg",
		name: "gggg",
		content: "gggg",
		parentFolder: { id: "33333333-3333-3333-3333-333333333333" },
	});

	for (const letter of "hijklmnopqrstuvwxyz") {
		fileStore.add({
			id: "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll("$", letter),
			name: letter.repeat(4),
			content: letter.repeat(4),
			parentFolder: { id: "home" },
		});
	}
}, { once: true });

openRequest.addEventListener("error", () => console.error(openRequest.error));

await new Promise((resolve) => openRequest.onsuccess = resolve);

export const database = new class {
	#database = openRequest.result;
	async #operation(/** @type {{ storeFunction: Function, transactionMode: IDBTransactionMode, store: string, funcParams: any[] }} */ {
		storeFunction,
		transactionMode,
		store,
		funcParams,
	}) {
		const transaction = this.#database.transaction(store, transactionMode);
		const foldersStore = transaction.objectStore(store);
		const request = storeFunction.apply(foldersStore, funcParams);
		await new Promise((resolve) => request.addEventListener("success", resolve, { once: true }));
		return request.result;
	};
	async get(/** @type {{ store: string, id: string }} */ { store, id }) {
		return this.#operation({
			storeFunction: IDBObjectStore.prototype.get,
			transactionMode: "readonly",
			store,
			funcParams: [id],
		});
	};
	async add(/** @type {{ store: string, data: Record<string, any> }} */ { store, data }) {
		data = { id: crypto.randomUUID(), ...data };
		this.#operation({
			storeFunction: IDBObjectStore.prototype.add,
			transactionMode: "readwrite",
			store,
			funcParams: [data],
		});
		return /** @type {any} */ (data);
	};
	async put(/** @type {{ store: string, data: Record<string, any> }} */ { store, data }) {
		this.#operation({
			storeFunction: IDBObjectStore.prototype.put,
			transactionMode: "readwrite",
			store,
			funcParams: [data],
		});
		return /** @type {any} */ (data);
	};
	async delete(/** @type {{ store: string, id: string }} */ { store, id }) {
		this.#operation({
			storeFunction: IDBObjectStore.prototype.delete,
			transactionMode: "readwrite",
			store,
			funcParams: [id],
		});
	};
};
