
/// <reference path="../../nonstandards/index.d.ts" />
/// <reference path="./global.d.ts" />

import { $$ } from "./utils.js";
import { elements } from "./app.js";
import parseDocument from "./parse/document/parseDocument.js";
import renderDocument from "./render/document/renderDocument.js";
import { keyDown } from "./files.js";

export const startRendering = () => {
	let previousSectionsArray = [];

	for (const element of $$(":scope > .section", elements.htmlOutput)) {
		element.remove();
	}

	const handleInput = function (/** @type {InputEvent} */ { data } = /** @type {any} */ ({})) {
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

		const /** @type {any[]} */ sectionsArray = [];

		let sectionBracesDepth = 0;
		let currentSectionArray = [];
		const initialStringSections = value.split(/(?:\n(?=(?:#|-?{)))|(?:(?:(?<=})|\n)\n(?!(?:\n|#)))/g);
		for (let index = 0; index < initialStringSections.length; index++) {
			const stringSection = initialStringSections[index];
			for (const character of stringSection) {
				if (character === "{") {
					sectionBracesDepth++;
				} else if (character === "}" && sectionBracesDepth > 0) {
					sectionBracesDepth--;
				}
			}
			currentSectionArray.push(stringSection);
			if (sectionBracesDepth <= 0 || index === initialStringSections.length - 1) {
				sectionsArray.push({ string: currentSectionArray.join(" ") });
				currentSectionArray = [];
				sectionBracesDepth = 0;
			}
		}

		const sectionCountDifference = sectionsArray.length - previousSectionsArray.length;
		let currentRelativeSectionIndex = 0;

		for (let index = 0; index < sectionsArray.length; index++) {
			const section = sectionsArray[index];
			let stringMatches = previousSectionsArray[index - currentRelativeSectionIndex]?.string === section.string;

			if (!stringMatches) {
				if (sectionCountDifference < 0) {

					$while: while (currentRelativeSectionIndex > sectionCountDifference) {
						elements.htmlOutput.children[index].remove();
						currentRelativeSectionIndex--;

						if (previousSectionsArray[index - currentRelativeSectionIndex]?.string === section.string) {
							stringMatches = true;
							break $while;
						}
					}
				}

				if (!stringMatches) {
					const div = document.createElement("div");
					div.classList.add("section");
					div.append(renderDocument(parseDocument(section.string)));

					if (sectionCountDifference === currentRelativeSectionIndex) {
						elements.htmlOutput.children[index].replaceWith(div);
					} else if (sectionCountDifference > 0) {
						elements.htmlOutput.children[index].insertAdjacentElement("beforebegin", div);
						currentRelativeSectionIndex++;
					} else if (sectionCountDifference < 0) {
						elements.htmlOutputt.children[index].replaceWith(div);
					} else console.error("Error: This should never happen");
				}
			}
		}

		previousSectionsArray = sectionsArray;
	};

	elements.textInput.addEventListener("input", handleInput);

	handleInput.call(elements.textInput);
	document.body.classList.remove("file-dirty");
};

{
	let onlyShiftPressed = false;

	window.addEventListener("keydown", (event) => {
		if (elements.textInput) {
			if (event.key === "Shift" && !event.ctrlKey && !event.metaKey && !event.altKey) {
				onlyShiftPressed = true;
			} else {
				onlyShiftPressed = false;
			}
		}

		keyDown(event);
	});

	window.addEventListener("keyup", (event) => {
		if (event.key === "Shift" && onlyShiftPressed) {
			onlyShiftPressed = false;
			const { value, selectionStart, selectionEnd } = elements.textInput;
			if (value.slice(selectionStart, selectionStart + 2) === " }") {
				elements.textInput.selectionStart = elements.textInput.selectionEnd = selectionStart + 2;
			} else {
				elements.textInput.value = value.slice(0, selectionStart) + "{  }" + value.slice(selectionEnd);
				elements.textInput.selectionStart = elements.textInput.selectionEnd = selectionStart + 2;
			}
		}
	});
}

