
import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/renderMathML.js";

// polyfill for Safari < 15.4
Array.prototype.at ??= function (index) {
	return index >= 0 ? this[index] : this[this.length + index];
}

document.querySelector("textarea").addEventListener("input", function (/** @type {InputEvent} */ { data }) {
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
	const mathElement = document.querySelector("math");
	mathElement.innerHTML = mathRow.outerHTML;
});

