
/// <reference path="../../non-standards/index.d.ts" />
/// <reference path="./global.d.ts" />

import { $ } from "./utils.js";

import { elements } from "./app.js";

import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

import { keyDown } from "./files.js";

export const startRendering = () => {
	const textarea = /** @type {HTMLInputElement} */ ($("c-math .text-input textarea"));

	let mathElement = $("c-math .mathml-output math");

	textarea.addEventListener("input", function (/** @type {InputEvent} */ { data }) {
		const { value, selectionStart, selectionEnd } = this;

		document.body.classList.add("file-dirty");

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
		mathElement.innerHTML = mathRow.outerHTML;
	});

	textarea.dispatchEvent(new Event("input"));
	document.body.classList.remove("file-dirty");
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Dead") {
		event.preventDefault();
	} else {
		keyDown(event);
	}
});

