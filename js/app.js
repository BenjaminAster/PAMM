
import { $, mathmlSupported } from "./utils.js";

const customElementNames = [
	"math",
	"header",
	"files",
];

if (!mathmlSupported) {
	customElementNames.push("no-mathml");
	document.body.appendChild(document.createElement("c-no-mathml"));
}

await Promise.all(customElementNames.map(async (name) => {
	const html = await (await window.fetch(`./html/${name}.c.html`)).text();
	window.customElements.define(`c-${name}`, class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" }).appendChild((/** @type {HTMLTemplateElement} */ (
				new DOMParser().parseFromString(`<template>${html}</template>`, "text/html").head.firstElementChild
			)).content.cloneNode(true));
		};
	});
}));

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
	const checkReadyState = async () => {
		if (document.readyState === "complete") {
			for (let i = 0; i < 2; i++) {
				await new Promise((resolve) => window.requestAnimationFrame(resolve));
			}
			document.documentElement.style.removeProperty("--no-transition");
		}
	};
	checkReadyState();
	document.addEventListener("readystatechange", checkReadyState);
}

export { };
