
/// <reference path="../../non-standards/index.d.ts" />
/// <reference path="./global.d.ts" />

import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

import { $, mathmlSupported } from "./utils.js";
import "./app.js";
import { keyDown } from "./files.js";

navigator.serviceWorker.register("./service-worker.js", { scope: "./", updateViaCache: "all" });

export const startRendering = () => {
	const textarea = /** @type {HTMLInputElement} */ ($(".text-input", $("c-math").shadowRoot));

	let mathElement = $(".mathml-output", $("c-math").shadowRoot);

	// if (!MathMLSupported) {
	// 	mathElement.remove();
	// 	mathElement = /** @type {HTMLElement} */ (new DOMParser().parseFromString(
	// 		mathElement.outerHTML.replace(/^<math /, "<math-ml ").replace(/<\/math>$/, "</math-ml>"), "text/html"
	// 	).body.firstElementChild);
	// 	$("c-math").shadowRoot.appendChild(mathElement);
	// }

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

