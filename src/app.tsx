
import Header from "./components/header.tsx";
import Files from "./components/files.tsx";
import Editor from "./components/editor.tsx";

{
	HTMLTemplateElement.prototype.append = function (...items) {
		this.content.append(...items);
	};
}

document.documentElement.classList.add("no-transitions");


export const $ = <K extends string>(selector: K, root: HTMLElement | Document | DocumentFragment = document) => (
	root.querySelector(selector)
);

export const $$ = <K extends string>(selector: K, root: HTMLElement | Document | DocumentFragment = document) => (
	[...root.querySelectorAll(selector)]
);

export const fileSystemAccessSupported = Boolean(window.showSaveFilePicker && window.showOpenFilePicker);

export const isApple = navigator.userAgentData?.platform ? ["macOS", "iOS"].includes(navigator.userAgentData.platform) : /^(Mac|iP)/.test(navigator.platform);

export const encodeFile = ({ text, data = {} }: { text: string, data?: Record<string, any>; }) => {
	return `version 1\n-----\n${text}\n-----\n${JSON.stringify(data, null, "\t")}`;
};

export const parseHTML = Range.prototype.createContextualFragment.bind(new Range());

export const decodeFile = ({ fileContent }: { fileContent: string; }) => {
	const { data: dataString, text } = fileContent.match(/^version 1\n-----\n(?<text>.*)\n-----\n(?<data>{(?:(?!\n-----\n).)*})$/s)?.groups ?? {};
	const data = (() => {
		try {
			return JSON.parse(dataString);
		} catch (error) {
			throw new Error(`Couldn't read file: error parsing metadata JSON (${dataString})`, { cause: error });
		}
	})();
	return { text, data };
};

const executeOnTransitionEnd = async (element: Element, callback: Function) => {
	await Promise.allSettled(
		element.getAnimations().filter((animation) => animation instanceof CSSTransition).map(({ finished }) => finished)
	);
	callback();
};

export const removeAfterTransition = (element: HTMLElement) => {
	executeOnTransitionEnd(element, () => element.remove());
};

export const _expose = (object: Record<string, any>) => {
	for (const [key, value] of Object.entries(object)) (self as any)[key] = value;
};

export const removeRealChildren = (element: HTMLElement) => {
	for (const child of [...element.childNodes].filter(({ nodeName }) => nodeName !== "TEMPLATE")) {
		child.remove();
	}
};

export const database = await new class {
	#database: IDBDatabase;
	constructor() {
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

		return constructorPromise as Awaited<typeof constructorPromise>;
	};

	async #opration({
		callback,
		transactionMode,
		store: storeName,
	}: { callback: (store: IDBObjectStore) => IDBRequest, transactionMode: IDBTransactionMode, store: string; }) {
		const transaction = this.#database.transaction(storeName, transactionMode);
		const store = transaction.objectStore(storeName);
		const request = callback(store);
		request.addEventListener("error", () => console.error(request.error), { once: true });
		await new Promise((resolve) => request.addEventListener("success", resolve, { once: true }));
		return request.result;
	};
	async get({ store, key }: { store: string, key: string; }) {
		return await this.#opration({
			callback: (store) => store.get(key),
			transactionMode: "readonly",
			store,
		});
	};
	add = async <T extends Record<string, any>>({ store, data }: { store: string, data: T; }) => {
		await this.#opration({
			callback: (store) => store.add(data),
			transactionMode: "readwrite",
			store,
		});
		return data;
	};
	put = async <T extends Record<string, any>>({ store, data }: { store: string, data: T; }) => {
		await this.#opration({
			callback: (store) => store.put(data),
			transactionMode: "readwrite",
			store,
		});
		return data;
	};
	async delete({ store, key }: { store: string, key: string; }) {
		await this.#opration({
			callback: (store) => store.delete(key),
			transactionMode: "readwrite",
			store,
		});
	};
	async getAll({ store }: { store: string; }) {
		return await this.#opration({
			callback: (store) => store.getAll(),
			transactionMode: "readwrite",
			store,
		});
	};
};


{
	const introductionFileText = decodeFile({ fileContent: await (await window.fetch(import.meta.resolve("../assets/introduction.pamm"))).text() }).text;
	await database.put({ store: "files", data: { ...await database.get({ store: "files", key: "b-introduction" }), content: introductionFileText } });
}

{
	let engine: string;
	if (navigator.userAgentData?.brands?.find(({ brand }) => brand === "Chromium")) engine = "blink";
	else if (navigator.userAgent.match(/\bFirefox\//)) engine = "gecko";
	else if (navigator.userAgent.match(/\bChrome\//)) engine = "blink";
	else if (navigator.userAgent.match(/\bAppleWebKit\//)) engine = "webkit";
	else engine = "unknown";
	document.documentElement.dataset.engine = engine;
}

export const storage = new class {
	#pathname = new URL(document.baseURI).pathname;
	get(key: string) {
		try {
			return JSON.parse(localStorage.getItem(`${this.#pathname}:${key}`));
		} catch (error) {
			console.error(error);
			return null;
		}
	};
	set(key: string, value: any) {
		localStorage.setItem(`${this.#pathname}:${key}`, JSON.stringify(value));
	};
	remove(key: string) {
		localStorage.removeItem(`${this.#pathname}:${key}`);
	};
};

export const alert = async ({ message, userGestureCallback }: { message: string, userGestureCallback?: Function; }) => {
	const alertDialog =
		<dialog className="messagebox alert">
			<form method="dialog">
				<p className="message">{message}</p>
				<div className="buttons">
					<button className="ok">OK</button>
				</div>
			</form>
		</dialog> as any as HTMLDialogElement;
	document.body.append(alertDialog);
	alertDialog.showModal();
	const { promise, resolve } = Promise.withResolvers<void>();
	alertDialog.addEventListener("click", ({ target }) => {
		if (target === alertDialog) alertDialog.close();
	});
	alertDialog.addEventListener("close", async () => {
		await userGestureCallback?.();
		resolve();
	});
	await promise;
	removeAfterTransition(alertDialog);
};

export const confirm = async ({ message, userGestureCallback }: { message: string, userGestureCallback?: Function; }) => {
	const confirmDialog =
		<dialog className="messagebox confirm">
			<form method="dialog">
				<p className="message">{message}</p>
				<div className="buttons">
					<button value="ok" className="ok">OK</button>
					<button value="cancel" className="cancel">Cancel</button>
				</div>
			</form>
		</dialog> as any as HTMLDialogElement;
	document.body.append(confirmDialog);
	confirmDialog.showModal();
	const { promise, resolve } = Promise.withResolvers<void>();
	confirmDialog.addEventListener("click", ({ target }) => {
		if (target === confirmDialog) confirmDialog.close("cancel");
	});
	confirmDialog.addEventListener("close", async () => {
		await userGestureCallback?.();
		resolve();
	});
	await promise;
	removeAfterTransition(confirmDialog);
	return { accepted: confirmDialog.returnValue === "ok" };
};

_expose({ alert });

export const prompt = async ({ message, defaultValue = "" }: { message: string, defaultValue?: string; }) => {
	let form: HTMLFormElement;
	const proptDialog =
		<dialog className="messagebox prompt">
			<form method="dialog" bind:this={form}>
				<p className="message">{message}</p>
				<input type="text" defaultValue={defaultValue} className="input" name="input" spellcheck={false} autocomplete="off" />
				<div className="buttons">
					<button value="ok" className="ok">OK</button>
					<button value="cancel" className="cancel">Cancel</button>
				</div>
			</form>
		</dialog> as any as HTMLDialogElement;
	document.body.append(proptDialog);
	proptDialog.showModal();
	const { promise, resolve } = Promise.withResolvers();
	proptDialog.addEventListener("click", ({ target }) => {
		if (target === proptDialog) proptDialog.close("cancel");
	});
	proptDialog.addEventListener("close", resolve);
	await promise;
	const accepted = proptDialog.returnValue === "ok";
	const value = accepted ? new FormData(form).get("input") as string : undefined;
	removeAfterTransition(proptDialog);
	return { accepted, value };
};

export const setTitle = (title: string) => {
	const titleArray = [title, appMeta.shortName];
	if (window.matchMedia("(display-mode: standalone), (display-mode: window-controls-overlay)").matches) titleArray.reverse();
	document.title = titleArray.join(" - ");
};

const useTransitions = Boolean(document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
// const useTransitions = false;

export const transition = async (
	callback: () => Promise<any>,
	{ name, resolveWhenFinished = false }: { name: string, resolveWhenFinished?: boolean; }
) => {
	if (!useTransitions || document.documentElement.classList.contains("no-transitions")) {
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

// {
// const customElements = {
// 	editor: Editor,
// 	header: Header,
// 	files: Files,
// };

// await Promise.all(Object.entries(customElements).map(async ([name, element]) => {
// 	// const html = await (await window.fetch(path)).text();
// 	// const content = parseHTML(html);

// 	// const styleElement = content.querySelector("style");
// 	// const css = `c-${name} { ${styleElement.textContent} }`;

// 	// styleElement.textContent = css + (
// 	// 	`\n/*# sourceMappingURL=data:application/json,${window.encodeURIComponent(JSON.stringify({
// 	// 		version: 3,
// 	// 		mappings: "",
// 	// 		sources: [`./html/${name}.c.html`],
// 	// 	}))} */`
// 	// );
// 	// styleElement.dataset.customElement = `c-${name}`;
// 	// document.head.append(styleElement);

// 	window.customElements.define(`c-${name}`, class extends HTMLElement {
// 		// #content = content;
// 		constructor() {
// 			super();
// 			queueMicrotask(() => {
// 				// this.append(this.#content.cloneNode(true));
// 				this.append(element());
// 			});
// 			// this.append(element());
// 		};
// 		connectedCallback() {
// 		};
// 	});
// 	}));
// }

export const elements = {
	header: <Header /> as any as HTMLElement,
	get myFilesLink() { return $("a[data-action=my-files]", elements.header); },
	get saveButton() { return $("button[data-action=save]", elements.header); },
	get exportButton() { return $("button[data-action=export]", elements.header); },
	get recentlyOpenedDialog() { return $("dialog.recently-opened", this.files); },
	get recentlyOpenedButton() { return $("button[data-action=recently-opened]", elements.header); },
	get openButton() { return $("button[data-action=open]", elements.header); },
	get uploadButton() { return $("button[data-action=upload]", elements.header); },
	get newFolderButton() { return $("button[data-action=new-folder]", this.files); },
	get newBrowserFileButton() { return $("button[data-action=new-browser-file]", this.files); },
	get newDiskFileButton() { return $("button[data-action=new-disk-file]", this.files); },
	get foldersUL() { return $("ul.folders", this.files); },
	get filesUL() { return $("ul.files", this.files); },
	get breadcrumbUL() { return $("nav.breadcrumb ul", this.files); },
	get fileNameInput() { return $("input[name=file-name]", elements.header); },
	get toggleThemeButton() { return $("button[data-action=toggle-theme]", elements.header); },
	get toggleLayoutButton() { return $("button[data-action=toggle-editor-layout]", elements.header); },
	files: <Files /> as any as HTMLElement,
	editor: <Editor /> as any as HTMLElement,
	get textInput() { return $(".text-input .textarea", this.editor); },
	get htmlOutput() { return $("section.html-output", this.editor); },
	get headersAndFooters() { return $("#headers-and-footers"); },
	get paperSizeMeasurement() { return $("#paper-size-measurement"); },
	get contentEndElement() { return $("#content-end-element"); },
	appTitleMeta: document.querySelector("meta[name=app-title]"),
};

document.body.replaceChildren(
	<noscript>Please enable JavaScript to view this site.</noscript>,

	elements.header,

	<main>
		{elements.files}
	</main>,

	<div id="dummy"></div>
);

if (navigator.windowControlsOverlay) {
	// document.documentElement.classList.add("no-wco-animation");
	const mediaMatch = window.matchMedia("(display-mode: window-controls-overlay)");
	mediaMatch.addEventListener("change", () => {
		document.documentElement.classList.remove("no-wco-animation");
	}, { once: true });
}

setTimeout(() => {
	let beforeInstallPromptEvent: BeforeInstallPromptEvent;
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
}, 100);

{
	const canHoverMatch = window.matchMedia("(hover)");
	const update = () => {
		document.documentElement.classList.toggle("can-hover", canHoverMatch.matches);
	};
	update();
	canHoverMatch.addEventListener("change", update);
}

// document.body.append(<c-header />);
// document.body.append(<main><c-files /></main>);

// await new Promise(setTimeout);

{
	// console.log(document.documentElement.outerHTML);
	for (const button of $$("button[data-action].keep-focus", elements.header)) {
		button.addEventListener("pointerdown", (event) => {
			event.preventDefault();
		});
	}
}

{
	// color theme
	const button = elements.toggleThemeButton;
	const mediaMatch = window.matchMedia("(prefers-color-scheme: light)");
	const themeInStorage = storage.get("color-theme") ?? "os-default";
	let currentTheme = ((themeInStorage === "os-default" && mediaMatch.matches) || themeInStorage === "light") ? "light" : "dark";
	let mouseX = 0;
	let mouseY = 0;

	const themeColorMetaElement = <meta name="theme-color" content="oklch(0.29 0.016 290.4)" />;
	document.head.append(themeColorMetaElement);

	const updateTheme = async () => {
		document.documentElement.style.setProperty("--animation-origin-x", button.offsetLeft + button.offsetWidth / 2);
		document.documentElement.style.setProperty("--animation-origin-y", button.offsetTop + button.offsetHeight / 2);
		await transition(async () => {
			await new Promise(res => setTimeout(res));
			document.documentElement.classList.toggle("light-theme", currentTheme === "light");
			const themeColor = window.getComputedStyle(document.documentElement).backgroundColor.trim();
			themeColorMetaElement.content = themeColor;
		}, { name: "theme-change", resolveWhenFinished: true });
		document.documentElement.style.removeProperty("--animation-origin-x");
		document.documentElement.style.removeProperty("--animation-origin-y");
	};
	updateTheme();

	button.addEventListener("click", async (event) => {
		currentTheme = currentTheme === "dark" ? "light" : "dark";
		storage.set("color-theme", ((currentTheme === "light") === mediaMatch.matches) ? "os-default" : currentTheme);
		mouseX = event.clientX;
		mouseY = event.clientY;
		updateTheme();
	});

	mediaMatch.addEventListener("change", ({ matches }) => {
		currentTheme = matches ? "light" : "dark";
		storage.set("color-theme", "os-default");
		updateTheme();
	});
}

{
	$("img.logo").addEventListener("dblclick", async () => {
		if (document.fullscreenElement) await document.exitFullscreen();
		else await document.documentElement.requestFullscreen();
	});
}
