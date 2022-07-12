
/// <reference path="../../nonstandards/index.d.ts" />
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
 - "Export" menu instead of separate download and print/PDF buttons
 - export HTML option in export menu
 - update title for files
 - choose custom font with Local Font Access API
 - horizontal/vertical layout switching
 - refresh all file lists after drag-&-drop (including other tabs)
*/

import { $ } from "./utils.js";
import { elements } from "./app.js";
import parseDocument from "./parse/document/parseDocument.js";
import renderDocument from "./render/document/renderDocument.js";
import { keyDown } from "./files.js";

export const startRendering = () => {
	let htmlOutput = $("c-math .html-output");

	elements.textInput.addEventListener("input", function (/** @type {InputEvent} */ { data }) {
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
		const tree = parseDocument(value);
		htmlOutput.append(renderDocument(tree));
	});

	elements.textInput.dispatchEvent(new Event("input"));
	document.body.classList.remove("file-dirty");
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Dead") {
		event.preventDefault();
	} else {
		keyDown(event);
	}
});

