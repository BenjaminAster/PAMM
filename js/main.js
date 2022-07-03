
/// <reference path="./global.d.ts" />


/* TODO:
 - replace native dialogs with custom ones
 - prevent folders from being dropped into containing or contained folder
 - don't re-render all breadcrumb elements every time
 - make breadcrumb elements draggable
 - keyboard shortcuts for navigating, rename, delete, permalink, cut, paste
 - recently opened file system files & ids in history.state
 - make "My files" an anchor
 - File name textbox: renaming and showing file name
 - remove redundant leftover stuff from shadow DOM implementation
 - "Export" menu instead of separate download and print/PDF buttons
 - export HTML option in export menu
*/


import { $ } from "./utils.js";

import { elements } from "./app.js";

import parseDocument from "./parseDocument/parseDocument.js";

import { keyDown } from "./files.js";

export const startRendering = () => {
	const textarea = /** @type {HTMLInputElement} */ ($("c-math .text-input textarea"));

	let htmlOutput = $("c-math .html-output");

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

		htmlOutput.innerHTML = "";
		htmlOutput.append(parseDocument(value));
		htmlOutput.innerHTML = htmlOutput.innerHTML;
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

