
import { $, mathmlSupported } from "./utils.js";

navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });

const customElementNames = [
	"math",
	"header",
	"files",
];

if (!mathmlSupported) {
	customElementNames.push("no-mathml");
	document.body.appendChild(document.createElement("c-no-mathml"));
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

{
	let prevVisible = false;
	const toggleWCO = ({ visible, manuallyToggled = true }) => {
		document.body.classList.toggle("window-controls-overlay", visible);
		if (manuallyToggled && prevVisible === false) $("c-header").style.removeProperty("--no-wco-animation");
		else $("c-header").style.setProperty("--no-wco-animation", "none");
		prevVisible = visible;
	};
	if (navigator.windowControlsOverlay?.visible) toggleWCO({ visible: true, manuallyToggled: false });
	navigator.windowControlsOverlay?.addEventListener("geometrychange", toggleWCO);
}

{
	let /** @type {BeforeInstallPromptEvent} */ beforeInstallPromptEvent;
	const button = $("button[data-action=install]");
	window.addEventListener("beforeinstallprompt", (/** @type {BeforeInstallPromptEvent} */ event) => {
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
			for (let i = 0; i < 2; i++) {
				await new Promise((resolve) => window.requestAnimationFrame(resolve));
			}
			document.body.classList.remove("loading");
		}
	};
	checkReadyState();
	document.addEventListener("readystatechange", checkReadyState);
}


