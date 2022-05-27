
import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

import { $ } from "./utils.js";
import "./customElements.js";
import "./files.js";

export const startRendering = () => {
	const textarea = /** @type {HTMLInputElement} */ ($(".text-input", $("c-math").shadowRoot));

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
		const mathElement = $(".mathml-output", $("c-math").shadowRoot);
		mathElement.innerHTML = mathRow.outerHTML;
	});

	textarea.dispatchEvent(new Event("input"));
}
