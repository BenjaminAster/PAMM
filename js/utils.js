

export const $ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement} */ (root.querySelector(selector)))
);

export const $$ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]))
);

export const fileSystemAccessSupported = !!(window.showSaveFilePicker && window.showOpenFilePicker);

export const isApple = navigator.userAgentData?.platform ? ["macOS", "iOS"].includes(navigator.userAgentData.platform) : /^(Mac|iP)/.test(navigator.platform);

export const /** @type {any} */ trace = (/** @type {any[]} */ ...args) => console.trace(...args);

export const createMathElement = (/** @type {string} */ name) => /** @type {MathMLElement} */(document.createElementNS("http://www.w3.org/1998/Math/MathML", name));

export const database = await new class {
	#database;
	constructor() {
		this.#database = /** @type {IDBDatabase} */ (null);
		// @ts-ignore
		return (async () => {
			const request = window.indexedDB.open(new URL(document.baseURI).pathname, 1);

			request.addEventListener("upgradeneeded", async () => {
				const folderStore = request.result.createObjectStore("folders", { keyPath: "id" });
				const fileStore = request.result.createObjectStore("files", { keyPath: "id" });
				request.result.createObjectStore("file-handles", { keyPath: "id" });
				const keyValueStore = request.result.createObjectStore("key-value", { keyPath: "key" });
				keyValueStore.add({
					key: "recently-opened",
					value: [],
				});

				folderStore.add({
					id: "home",
					name: "Home",
					parentFolder: null,
					folders: [
						{ id: "11111111-1111-1111-1111-111111111111" },
						{ id: "22222222-2222-2222-2222-222222222222" },
					],
					files: [
						{ id: "b-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
						{ id: "b-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
						{ id: "b-cccccccc-cccc-cccc-cccc-cccccccccccc" },
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
						{ id: "b-dddddddd-dddd-dddd-dddd-dddddddddddd" },
						{ id: "b-eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee" },
					],
				});

				folderStore.add({
					id: "22222222-2222-2222-2222-222222222222",
					name: "2222",
					parentFolder: { id: "home" },
					folders: [],
					files: [
						{ id: "b-ffffffff-ffff-ffff-ffff-ffffffffffff" },
					],
				});

				folderStore.add({
					id: "33333333-3333-3333-3333-333333333333",
					name: "3333",
					parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
					folders: [],
					files: [
						{ id: "b-gggggggg-gggg-gggg-gggg-gggggggggggg" },
					],
				});

				fileStore.add({
					id: "b-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
					name: "aaaa",
					content: "aaaa",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
					name: "bbbb",
					content: "bbbb",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-cccccccc-cccc-cccc-cccc-cccccccccccc",
					name: "cccc",
					content: "cccc",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-dddddddd-dddd-dddd-dddd-dddddddddddd",
					name: "dddd",
					content: "dddd",
					parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
				});

				fileStore.add({
					id: "b-eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
					name: "eeee",
					content: "eeee",
					parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
				});

				fileStore.add({
					id: "b-ffffffff-ffff-ffff-ffff-ffffffffffff",
					name: "ffff",
					content: "ffff",
					parentFolder: { id: "22222222-2222-2222-2222-222222222222" },
				});

				fileStore.add({
					id: "b-gggggggg-gggg-gggg-gggg-gggggggggggg",
					name: "gggg",
					content: "gggg",
					parentFolder: { id: "33333333-3333-3333-3333-333333333333" },
				});
			}, { once: true });

			request.addEventListener("error", () => console.error(request.error), { once: true });

			await new Promise((resolve) => request.addEventListener("success", resolve, { once: true }));

			this.#database = request.result;

			return this;
		})();
	};

	async #operation(/** @type {{ callback: (store: IDBObjectStore) => IDBRequest, transactionMode: IDBTransactionMode, store: string }} */ {
		callback,
		transactionMode,
		store: storeName,
	}) {
		const transaction = this.#database.transaction(storeName, transactionMode);
		const store = transaction.objectStore(storeName);
		const request = callback(store);
		request.addEventListener("error", () => console.error(request.error), { once: true });
		await new Promise((resolve) => request.addEventListener("success", resolve, { once: true }));
		return request.result;
	};
	async get(/** @type {{ store: string, key: string }} */ { store, key }) {
		return await this.#operation({
			callback: (store) => store.get(key),
			transactionMode: "readonly",
			store,
		});
	};
	async add(/** @type {{ store: string, data: Record<string, any> }} */ { store, data }) {
		await this.#operation({
			callback: (store) => store.add(data),
			transactionMode: "readwrite",
			store,
		});
		return /** @type {any} */ (data);
	};
	async put(/** @type {{ store: string, data: Record<string, any> }} */ { store, data }) {
		await this.#operation({
			callback: (store) => store.put(data),
			transactionMode: "readwrite",
			store,
		});
		return /** @type {any} */ (data);
	};
	async delete(/** @type {{ store: string, key: string }} */ { store, key }) {
		await this.#operation({
			callback: (store) => store.delete(key),
			transactionMode: "readwrite",
			store,
		});
	};
};

const messageboxesTemplate = /** @type {HTMLTemplateElement} */ ($("template#messageboxes")).content;

export const alert = async (/** @type {{ message: string, userGestureCallback?: Function }} */ { message, userGestureCallback }) => {
	const dialog = /** @type {HTMLDialogElement} */ ($("dialog.alert", messageboxesTemplate).cloneNode(true));
	$(".message", dialog).textContent = message;
	document.body.append(dialog);
	dialog.showModal();
	await new Promise((resolve) => $("button.ok", dialog).addEventListener("click", async () => {
		await userGestureCallback?.();
		resolve();
	}, { once: true }));
	dialog.remove();
};

export const confirm = async (/** @type {{ message: string, userGestureCallback?: Function }} */ { message, userGestureCallback }) => {
	const dialog = /** @type {HTMLDialogElement} */ ($("dialog.confirm", messageboxesTemplate).cloneNode(true));
	$(".message", dialog).textContent = message;
	document.body.append(dialog);
	dialog.showModal();
	const accepted = await new Promise((resolve) => {
		$("button.ok", dialog).addEventListener("click", async () => {
			await userGestureCallback?.();
			resolve(true);
		}, { once: true });
		$("button.cancel", dialog).addEventListener("click", () => resolve(false), { once: true });
	});
	dialog.remove();
	return { accepted };
};

export const prompt = async (/** @type {{ message: string, defaultValue?: string }} */ { message, defaultValue = "" }) => {
	const dialog = /** @type {HTMLDialogElement} */ ($("dialog.prompt", messageboxesTemplate).cloneNode(true));
	$(".message", dialog).textContent = message;
	;/** @type {HTMLInputElement} */ ($(".input", dialog)).value = defaultValue;
	document.body.append(dialog);
	dialog.showModal();
	const accepted = await new Promise((resolve) => {
		$(".input", dialog).addEventListener("keydown", ({ key }) => { if (key === "Enter") resolve(true) });
		$("button.ok", dialog).addEventListener("click", () => resolve(true), { once: true });
		$("button.cancel", dialog).addEventListener("click", () => resolve(false), { once: true });
	});
	const value = accepted ? /** @type {HTMLInputElement} */ ($(".input", dialog)).value : undefined;
	dialog.remove();
	return { accepted, value };
};

{
	// for debugging

	window.log = (data, trace = false) => {
		const logFunction = trace ? console.trace : console.log;
		const originalData = data;
		try {
			data = structuredClone(data);
		} catch { };

		$switch: switch (data instanceof Object && !Array.isArray(data)) {
			case (true): {
				let objectEntries = Object.entries(data);
				if (objectEntries.length === 1) {
					logFunction(`${objectEntries[0][0]}:`, objectEntries[0][1]);
					break $switch;
				}
			} case (false): {
				logFunction(data);
			}
		}

		return originalData;
	};

	Object.defineProperty(window, "r", {
		get() {
			for (const element of /** @type {any} */ ($(".html-output").children)) {
				element.style.color = "red";
			}
		},
	});

	// @ts-ignore
	window.database = database;
	window.alert = alert;
}
