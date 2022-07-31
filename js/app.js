
/// <reference path="../../nonstandards/index.d.ts" />

import { $ } from "./utils.js";

navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });

export const elements = {
	get textInput() { return /** @type {HTMLTextAreaElement} */ ($("c-math .text-input")) },
	get myFilesButton() { return $("c-header [data-action=my-files]") },
	get saveButton() { return $("c-header [data-action=save]") },
	get downloadButton() { return $("c-header [data-action=download]") },
	get printButton() { return $("c-header [data-action=print]") },
	get openButton() { return $("c-header [data-action=open]") },
	get uploadButton() { return $("c-header [data-action=upload]") },
	get newFolderButton() { return $("c-files [data-action=new-folder]") },
	get newBrowserFileButton() { return $("c-files [data-action=new-browser-file]") },
	get newDiskFileButton() { return $("c-files [data-action=new-disk-file]") },
	get foldersUL() { return $("c-files .folders") },
	get filesUL() { return $("c-files .files") },
	get breadcrumbUL() { return $("c-files nav.breadcrumb ul") },
};

const customElementNames = [
	"math",
	"header",
	"files",
];

if (!window.MathMLElement) {
	customElementNames.push("no-mathml");
	document.body.insertAdjacentElement("afterbegin", Object.assign(document.createElement("c-no-mathml"), { id: "hide-mathml-warning" }));
}

{
	const tempDocument = document.implementation.createHTMLDocument();

	const hostRegex = /:host\b/;
	const editRule = (/** @type {any} */ rule, /** @type {string} */ name) => {
		const selector = rule.selectorText;
		rule.selectorText = hostRegex.test(selector) ? selector.replace(hostRegex, `c-${name}`) : `c-${name} ${selector}`;
	};
	const editRulesRecursively = (/** @type {any} */ rules, /** @type {string} */ name) => {
		for (const rule of rules) {
			switch (rule.constructor.name) {
				case ("CSSStyleRule"): {
					editRule(rule, name);
					break;
				}
				case ("CSSMediaRule"): case ("CSSSupportsRule"): case ("CSSLayerBlockRule"): {
					editRulesRecursively(rule.cssRules, name);
					break;
				}
			}
		}
	};

	await Promise.all(customElementNames.map(async (name) => {
		const html = await (await window.fetch(`./html/${name}.c.html`)).text();
		const content = (/** @type {HTMLTemplateElement} */ (
			new DOMParser().parseFromString(`<template>${html}</template>`, "text/html").head.firstElementChild
		)).content;

		const styleElement = content.querySelector("style");
		styleElement.remove();

		tempDocument.body.appendChild(styleElement);

		const rules = styleElement.sheet.cssRules;

		editRulesRecursively(rules, name);

		styleElement.textContent = [...rules].map((rule) => rule.cssText).join("\n") + (
			`\n/*# sourceMappingURL=data:,${window.encodeURIComponent(JSON.stringify({
				version: 3,
				mappings: "",
				sources: [`./html/${name}.c.html`],
			}))} */`
		);
		styleElement.dataset.customElement = `c-${name}`;
		document.head.appendChild(styleElement);

		window.customElements.define(`c-${name}`, class extends HTMLElement {
			#content = content;
			constructor() {
				super();
			};
			connectedCallback() {
				this.appendChild(this.#content.cloneNode(true));
			};
		});
	}));
}

if (navigator.windowControlsOverlay) {
	let previousVisible = false;
	const toggleWCO = ({ visible, manuallyToggled = true }) => {
		document.body.classList.toggle("window-controls-overlay", visible);
		if (manuallyToggled && previousVisible === false) document.body.classList.remove("no-wco-animation");
		else document.body.classList.add("no-wco-animation");
		previousVisible = visible;
	};
	if (navigator.windowControlsOverlay.visible) toggleWCO({ visible: true, manuallyToggled: false });
	navigator.windowControlsOverlay.addEventListener("geometrychange", toggleWCO);
}

{
	let /** @type {BeforeInstallPromptEvent} */ beforeInstallPromptEvent;
	const button = $("button[data-action=install]");
	window.addEventListener("beforeinstallprompt", (event) => {
		beforeInstallPromptEvent = event;
		button.hidden = false;
	});
	button.addEventListener("click", async () => {
		if ((await beforeInstallPromptEvent.prompt()).outcome === "accepted") button.hidden = true;
	});
}

{
	const checkReadyState = async () => {
		if (document.readyState === "complete") {
			for (let i = 0; i < 2; i++) await new Promise((resolve) => window.requestAnimationFrame(resolve));
			document.body.classList.remove("loading");
		}
	};
	checkReadyState();
	document.addEventListener("readystatechange", checkReadyState);
}

