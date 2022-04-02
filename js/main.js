
import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

import { $ } from "./utils.js";

{
	// polyfill for Safari < 15.4
	Array.prototype.at ??= function (index) {
		return index >= 0 ? this[index] : this[this.length + index];
	}
}

{
	const customElementNames = [
		"Math",
	];

	if (!window.MathMLElement) {
		customElementNames.push("NoMathML");
		document.body.appendChild(document.createElement("NoMathML-"));
	}

	for await (const { name, html } of customElementNames.map(async (name) => ({
		name,
		html: await (await window.fetch(`./html/${name}.c.html`)).text(),
	}))) {
		window.customElements.define(`${name.toLowerCase()}-`, class extends HTMLElement {
			constructor() {
				super();
				this.attachShadow({ mode: "open" }).appendChild((/** @type {HTMLTemplateElement} */ (
					new DOMParser().parseFromString(`<template>${html}</template>`, "text/html").head.firstElementChild
				)).content.cloneNode(true));
			};
		});
	}
}

(/** @type {HTMLInputElement} */ ($(".📝", $(".🧮").shadowRoot))).addEventListener("input", function (/** @type {InputEvent} */ { data }) {
	const { value, selectionStart, selectionEnd } = this;

	if (data?.match(/^[([{]$/)) {
		if (selectionStart === selectionEnd) {
			const bracketPairs = {
				"(": ")",
				"[": "]",
				"{": "}",
			};
			this.value = value.slice(0, selectionStart) + bracketPairs[data] + value.slice(selectionEnd);
			this.selectionStart = this.selectionEnd = selectionStart;
		}
	}

	const tree = parseString(value);
	const mathRow = generateMathML(tree);
	const mathElement = $(".🔢", $(".🧮").shadowRoot);
	mathElement.innerHTML = mathRow.outerHTML;
});
