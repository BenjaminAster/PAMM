
import parseString from "./parser/parseString.js";
import generateMathML from "./mathml/generateMathML.js";

// polyfill for Safari < 15.4
Array.prototype.at ??= function (index) {
	return index >= 0 ? this[index] : this[this.length + index];
}

document.querySelector("textarea").addEventListener("input", function () {
	const { value } = this;

	const tree = parseString(value);
	const fragment = generateMathML(tree);

	const pre = document.querySelector("pre");
	pre.innerHTML = "";
	pre.append(fragment);
});

