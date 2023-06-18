
/// <reference types="better-typescript" />
/// <reference path="./global.d.ts" />

export const $ = /** @template {string} K */ (/** @type {K} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	root.querySelector(selector)
);

export const $$ = /** @template {string} K */ (/** @type {K} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	[...root.querySelectorAll(selector)]
);

export const fileSystemAccessSupported = Boolean(window.showSaveFilePicker && window.showOpenFilePicker);

export const isApple = navigator.userAgentData?.platform ? ["macOS", "iOS"].includes(navigator.userAgentData.platform) : /^(Mac|iP)/.test(navigator.platform);

export const createMathElement = (/** @type {string} */ name) => document.createElementNS("http://www.w3.org/1998/Math/MathML", name);

export const encodeFile = (/** @type {{ text: string, data?: Record<string, any> }} */ { text, data = {} }) => {
	return `version 1\n-----\n${text}\n-----\n${JSON.stringify(data, null, "\t")}`
};

export const decodeFile = (/** @type {{ fileContent: string }} */ { fileContent }) => {
	const { data: dataString, text } = fileContent.match(/^version 1\n-----\n(?<text>.*)\n-----\n(?<data>{(?:(?!\n-----\n).)*})$/s)?.groups ?? {};
	const data = (() => {
		try {
			return JSON.parse(dataString);
		} catch (error) {
			throw new Error(`Couldn't read file: error parsing metadata JSON (${dataString})`, { cause: error });
		}
	})();
	return { text, data };
}

export const database = await new class {
	#database;
	constructor() {
		this.#database = /** @type {IDBDatabase} */ (null);
		const constructorPromise = (async () => {
			const request = window.indexedDB.open(new URL(document.baseURI).pathname, 1);

			request.addEventListener("upgradeneeded", () => {
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
						{ id: "b-introduction" },
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
					id: "b-introduction",
					name: "Introduction",
					content: "",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
					name: "aaaa",
					content: "# aaaa\n\naaaa",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
					name: "bbbb",
					content: "# bbbb\n\nbbbb",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-cccccccc-cccc-cccc-cccc-cccccccccccc",
					name: "cccc",
					content: "# cccc\n\ncccc",
					parentFolder: { id: "home" },
				});

				fileStore.add({
					id: "b-dddddddd-dddd-dddd-dddd-dddddddddddd",
					name: "dddd",
					content: "# dddd\n\ndddd",
					parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
				});

				fileStore.add({
					id: "b-eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
					name: "eeee",
					content: "# eeee\n\neeee",
					parentFolder: { id: "11111111-1111-1111-1111-111111111111" },
				});

				fileStore.add({
					id: "b-ffffffff-ffff-ffff-ffff-ffffffffffff",
					name: "ffff",
					content: "# ffff\n\nffff",
					parentFolder: { id: "22222222-2222-2222-2222-222222222222" },
				});

				fileStore.add({
					id: "b-gggggggg-gggg-gggg-gggg-gggggggggggg",
					name: "gggg",
					content: "# gggg\n\ngggg",
					parentFolder: { id: "33333333-3333-3333-3333-333333333333" },
				});
			}, { once: true });

			request.addEventListener("error", () => console.error(request.error), { once: true });

			await new Promise((resolve) => request.addEventListener("success", resolve, { once: true }));

			this.#database = request.result;

			return this;
		})();

		return /** @type {Awaited<typeof constructorPromise>} */ (constructorPromise);
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
	add = /** @template {Record<string, any>} T */ async (/** @type {{ store: string, data: T }} */ { store, data }) => {
		await this.#operation({
			callback: (store) => store.add(data),
			transactionMode: "readwrite",
			store,
		});
		return data;
	};
	put = /** @template {Record<string, any>} T */ async (/** @type {{ store: string, data: T }} */ { store, data }) => {
		await this.#operation({
			callback: (store) => store.put(data),
			transactionMode: "readwrite",
			store,
		});
		return data;
	};
	async delete(/** @type {{ store: string, key: string }} */ { store, key }) {
		await this.#operation({
			callback: (store) => store.delete(key),
			transactionMode: "readwrite",
			store,
		});
	};
	async getAll(/** @type {{ store: string }} */ { store }) {
		return await this.#operation({
			callback: (store) => store.getAll(),
			transactionMode: "readwrite",
			store,
		});
	};
};


{
	const introductionFileText = decodeFile({ fileContent: await (await window.fetch("./assets/introduction.pamm")).text() }).text;
	await database.put({ store: "files", data: { ...await database.get({ store: "files", key: "b-introduction" }), content: introductionFileText } });
}

{
	let /** @type {string} */ engine;
	if (navigator.userAgentData?.brands?.find(({ brand }) => brand === "Chromium")) engine = "blink";
	else if (navigator.userAgent.match(/\bFirefox\//)) engine = "gecko";
	else if (navigator.userAgent.match(/\bChrome\//)) engine = "blink";
	else if (navigator.userAgent.match(/\bVersion\//)) engine = "webkit";
	else engine = "unknown";
	document.documentElement.dataset.engine = engine;
}

export const storage = new class {
	#pathname = new URL(document.baseURI).pathname;
	get(/** @type {string} */ key) {
		try {
			return JSON.parse(localStorage.getItem(`${this.#pathname}:${key}`));
		} catch (error) {
			console.error(error);
			return null;
		}
	};
	set(/** @type {string} */ key, /** @type {any} */ value) {
		localStorage.setItem(`${this.#pathname}:${key}`, JSON.stringify(value));
	};
	remove(/** @type {string} */ key) {
		localStorage.removeItem(`${this.#pathname}:${key}`);
	};
};


const messageboxesTemplate = $("template#messageboxes").content;

export const alert = async (/** @type {{ message: string, userGestureCallback?: Function }} */ { message, userGestureCallback }) => {
	const dialog = $("dialog.alert", messageboxesTemplate).cloneNode(true);
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
	const dialog = $("dialog.confirm", messageboxesTemplate).cloneNode(true);
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
	const dialog = $("dialog.prompt", messageboxesTemplate).cloneNode(true);
	$(".message", dialog).textContent = message;
	$("input.input", dialog).value = defaultValue;
	document.body.append(dialog);
	dialog.showModal();
	const accepted = await new Promise((resolve) => {
		$(".input", dialog).addEventListener("keydown", ({ key }) => { if (key === "Enter") resolve(true) });
		$("button.ok", dialog).addEventListener("click", () => resolve(true), { once: true });
		$("button.cancel", dialog).addEventListener("click", () => resolve(false), { once: true });
	});
	const value = accepted ? $("input.input", dialog).value : undefined;
	dialog.remove();
	return { accepted, value };
};

export const setTitle = (/** @type {string} */ title) => {
	const titleArray = [
		title,
		" – ",
		appMeta.shortName,
	];
	if (window.matchMedia("(display-mode: standalone), (display-mode: window-controls-overlay)").matches) titleArray.reverse();
	document.title = titleArray.join("");
};

const useTransitions = Boolean(document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
// const useTransitions = false;

export const transition = async (/** @type {() => Promise<any>} */ callback, /** @type {{ name?: string, resolveWhenFinished?: boolean }} */ { name, resolveWhenFinished = false } = {}) => {
	if (!useTransitions || document.documentElement.classList.contains("loading")) {
		await callback();
		return;
	}

	document.documentElement.dataset.transition = name;
	const transition = document.startViewTransition(callback);
	transition.finished.then(() => {
		delete document.documentElement.dataset.transition;
	});
	await (resolveWhenFinished ? transition.finished : transition.ready);
};

{
	// for debugging

	window.log = (data, trace = false) => {
		const logFunction = trace ? console.trace : console.log;
		const originalData = data;
		try {
			data = structuredClone(data);
		} catch { };

		$: {
			if (data instanceof Object && !Array.isArray(data)) {
				let objectEntries = Object.entries(data);
				if (objectEntries.length === 1) {
					logFunction(`${objectEntries[0][0]}:`, objectEntries[0][1]);
					break $;
				}
			}

			logFunction(data);
		}

		return originalData;
	};

	Object.defineProperty(window, "r", {
		get() {
			for (const element of $(".html-output").children) {
				element.style.color = "red";
			}
		},
	});

	// @ts-ignore
	window.database = database;
}


export const appMeta = {
	name: "Pretty Awesome Math Markup",
	shortName: "PAMM",
	fileExtension: ".pamm",
	mimeType: "text/pretty-awesome-math-markup",
};

navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });


{
	const customElements = [
		"editor",
		"header",
		"files",
	];

	const tempDocument = document.implementation.createHTMLDocument();

	const hostRegex = /:host\b/g;
	const editRule = (/** @type {any} */ rule, /** @type {string} */ name) => {
		const selector = rule.selectorText;
		rule.selectorText = hostRegex.test(selector) ? selector.replaceAll(hostRegex, `c-${name}`) : `c-${name} ${selector}`;
	};
	const editRulesRecursively = (/** @type {any} */ rules, /** @type {string} */ name) => {
		for (const rule of rules) {
			switch (rule.constructor.name) {
				case ("CSSStyleRule"): {
					editRule(rule, name);
					break;
				}
				case ("CSSMediaRule"): case ("CSSSupportsRule"): case ("CSSLayerBlockRule"): case ("CSSContainerRule"): {
					editRulesRecursively(rule.cssRules, name);
					break;
				}
			}
		}
	};

	await Promise.all(customElements.map(async (name) => {
		const html = await (await window.fetch(`./html/${name}.c.html`)).text();
		const content = (/** @type {HTMLTemplateElement} */ (
			new DOMParser().parseFromString(`<template>${html}</template>`, "text/html").head.firstElementChild
		)).content;

		const styleElement = content.querySelector("style");
		styleElement.remove();

		tempDocument.body.append(styleElement);

		const rules = styleElement.sheet.cssRules;

		editRulesRecursively(rules, name);

		styleElement.textContent = [...rules].map((rule) => rule.cssText).join("\n") + (
			`\n/*# sourceMappingURL=data:application/json,${window.encodeURIComponent(JSON.stringify({
				version: 3,
				mappings: "",
				sources: [`./html/${name}.c.html`],
			}))} */`
		);
		styleElement.dataset.customElement = `c-${name}`;
		document.head.append(styleElement);

		window.customElements.define(`c-${name}`, class extends HTMLElement {
			#content = content;
			constructor() {
				super();
				queueMicrotask(() => {
					this.append(this.#content.cloneNode(true));
				});
			};
			connectedCallback() {
			};
		});
	}));
}

export const elements = {
	get myFilesLink() { return $("c-header a[data-action=my-files]") },
	get saveButton() { return $("c-header button[data-action=save]") },
	get exportButton() { return $("c-header button[data-action=export]") },
	get recentlyOpenedDialog() { return $("c-files dialog.recently-opened") },
	get recentlyOpenedButton() { return $("c-header button[data-action=recently-opened]") },
	get openButton() { return $("c-header button[data-action=open]") },
	get uploadButton() { return $("c-header button[data-action=upload]") },
	get newFolderButton() { return $("c-files button[data-action=new-folder]") },
	get newBrowserFileButton() { return $("c-files button[data-action=new-browser-file]") },
	get newDiskFileButton() { return $("c-files button[data-action=new-disk-file]") },
	get foldersUL() { return $("c-files ul.folders") },
	get filesUL() { return $("c-files ul.files") },
	get breadcrumbUL() { return $("c-files nav.breadcrumb ul") },
	get fileNameInput() { return $("c-header input.file-name") },
	get toggleThemeButton() { return ($("c-header button[data-action=toggle-theme]")) },
	get toggleLayoutButton() { return ($("c-header button[data-action=toggle-editor-layout]")) },
	files: document.querySelector("c-files"),
	editor: document.createElement("c-editor"),
	get textInput() { return $(".text-input textarea", this.editor) },
	get htmlOutput() { return $("section.html-output", this.editor) },
};

// @ts-ignore
window.elements = elements;

if (navigator.windowControlsOverlay) {
	document.documentElement.classList.add("no-wco-animation");
	const mediaMatch = window.matchMedia("(display-mode: window-controls-overlay)");
	const onGeometryChange = (/** @type {{ matches: boolean }} */ { matches }) => {
		document.documentElement.classList.remove("no-wco-animation");
	};
	mediaMatch.addEventListener("change", onGeometryChange, { once: true });
}

{
	let /** @type {BeforeInstallPromptEvent} */ beforeInstallPromptEvent;
	const button = $("button[data-action=install]");
	window.addEventListener("beforeinstallprompt", (event) => {
		beforeInstallPromptEvent = event;
		button.hidden = false;
	});
	button.addEventListener("click", async () => {
		await beforeInstallPromptEvent.prompt();
	});
	window.addEventListener("appinstalled", () => {
		button.hidden = true;
		beforeInstallPromptEvent = undefined;
	});
}

{
	// color theme
	const button = elements.toggleThemeButton;
	const mediaMatch = window.matchMedia("(prefers-color-scheme: light)");
	const themeInStorage = storage.get("color-theme") ?? "os-default";
	let currentTheme = ((themeInStorage === "os-default" && mediaMatch.matches) || themeInStorage === "light") ? "light" : "dark";

	const updateTheme = () => {
		document.documentElement.classList.toggle("light-theme", currentTheme === "light");
		const themeColor = window.getComputedStyle(document.querySelector("c-header")).backgroundColor.trim();
		document.querySelector("meta[name=theme-color]").content = themeColor;
	};
	updateTheme();

	button.addEventListener("click", async () => {
		currentTheme = currentTheme === "dark" ? "light" : "dark";
		storage.set("color-theme", ((currentTheme === "light") === mediaMatch.matches) ? "os-default" : currentTheme);
		updateTheme();
	});

	mediaMatch.addEventListener("change", ({ matches }) => {
		currentTheme = matches ? "light" : "dark";
		storage.set("color-theme", "os-default");
		updateTheme();
	});
}

