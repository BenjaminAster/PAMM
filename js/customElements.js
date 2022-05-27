
import { $ } from "./utils.js";

const customElementNames = [
	"math",
	"header",
	"my-files",
];

// if (!window.MathMLElement) {
// 	customElementNames.push("no-mathml");
// 	document.body.appendChild(document.createElement("c-no-mathml"));
// }

await Promise.all(customElementNames.map(async (name) => {
	const html = await (await window.fetch(`./html/${name}.c.html`)).text();
	window.customElements.define(`c-${name.toLowerCase()}`, class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" }).appendChild((/** @type {HTMLTemplateElement} */ (
				new DOMParser().parseFromString(`<template>${html}</template>`, "text/html").head.firstElementChild
			)).content.cloneNode(true));
		};
	});
}));

export { };
