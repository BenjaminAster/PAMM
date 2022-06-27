
/// <reference path="../../non-standards/index.d.ts" />
/// <reference path="./global.d.ts" />

import { $, mathmlSupported } from "./utils.js";

import "./app.js";
import { keyDown } from "./files.js";

import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

export const startRendering = () => {
	const textarea = /** @type {HTMLInputElement} */ ($("c-math .text-input"));

	let mathElement = $("c-math .mathml-output");

	textarea.addEventListener("input", function (/** @type {InputEvent} */ { data }) {
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
		mathElement.innerHTML = mathRow.outerHTML;
	});

	textarea.dispatchEvent(new Event("input"));
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Dead") {
		event.preventDefault();
	} else {
		keyDown(event);
	}
});

