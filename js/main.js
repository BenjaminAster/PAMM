
/// <reference path="../../nonstandards/index.d.ts" />
/// <reference path="./global.d.ts" />

import { $ } from "./utils.js";
import { elements } from "./app.js";
import parseDocument from "./parse/document/parseDocument.js";
import renderDocument from "./render/document/renderDocument.js";
import { keyDown } from "./files.js";

export const startRendering = () => {
	let htmlOutput = $("c-math .html-output");

	// let previousSectionsArray = [];

	elements.textInput.addEventListener("input", function (/** @type {InputEvent} */ { data }) {
		const { value, selectionStart, selectionEnd } = this;

		document.body.classList.add("file-dirty");

		// if (data?.match(/^[([{]$/)) {
		// 	if (selectionStart === selectionEnd) {
		// 		const bracketPairs = {
		// 			"(": ")",
		// 			"[": "]",
		// 			"{": "}",
		// 		};
		// 		this.value = value.slice(0, selectionStart) + bracketPairs[data] + value.slice(selectionEnd);
		// 		this.selectionStart = this.selectionEnd = selectionStart;
		// 	}
		// }

		// const sectionsArray = [];

		// {
		// 	for (const section of value.split(/(?:\n(?=[#{]))|(?:(?:(?<=})|\n)\n(?![\n#]))/g)) {
		// 		sectionsArray.push(section);
		// 	}

		// 	console.log(sectionsArray);

		// }



		htmlOutput.innerHTML = "";
		const tree = parseDocument(value);
		htmlOutput.append(renderDocument(tree));

		// previousSectionsArray = sectionsArray;

		// log({ tree });
	});

	elements.textInput.dispatchEvent(new Event("input"));
	document.body.classList.remove("file-dirty");
};

window.addEventListener("keydown", (event) => {
	keyDown(event);
});

