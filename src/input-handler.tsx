
import { elements, $$, storage, transition } from "./app.tsx";
import parseDocument from "./parse/document/parseDocument.ts";
import renderDocument from "./render/document/renderDocument.tsx";
import { keyDown } from "./files.tsx";

CSS.highlights?.set("heading", new Highlight());
CSS.highlights?.set("code", new Highlight());
CSS.highlights?.set("math", new Highlight());
const selection = document.getSelection();

// export const { startRendering } = (() => {
export const startRendering = (() => {
	let previousSectionsArray: any[] = [];

	const handleInput = function ({ }: Partial<InputEvent> = {}) {
		// console.log('handle')
		const { textContent } = elements.textInput;

		document.documentElement.classList.add("file-dirty");

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

		const sectionsArray: any[] = [];

		let sectionBracesDepth = 0;
		let currentSectionArray = [];
		// const initialStringSections = value.split(/(?:\n(?=(?:#|-?{)))|(?:(?:(?<=})|\n)\n(?!(?:\n|#)))/g);
		const initialStringSections = textContent.split(/\n(?!\n)/g);
		let codeMode = false;
		let backslashEscaped = false;
		let currentCharIndex = 0;
		CSS.highlights?.get("code").clear();
		CSS.highlights?.get("math").clear();
		let currentCodeRange: Range;
		let currentMathRange: Range;
		for (let index = 0; index < initialStringSections.length; index++) {
			const stringSection = initialStringSections[index];
			for (const character of stringSection) {
				if (character === "`" && sectionBracesDepth === 0 && !backslashEscaped) {
					codeMode = !codeMode;

					if (codeMode) {
						currentCodeRange = new Range();
						currentCodeRange.setStart(elements.textInput.firstChild, currentCharIndex);
					} else {
						currentCodeRange.setEnd(elements.textInput.firstChild, currentCharIndex + 1);
						CSS.highlights?.get("code").add(currentCodeRange);
						currentCodeRange = undefined;
					}
				}

				if (!codeMode && !backslashEscaped) {
					if (character === "{") {
						sectionBracesDepth++;
						if (sectionBracesDepth === 1) {
							currentMathRange = new Range();
							currentMathRange.setStart(elements.textInput.firstChild, currentCharIndex);
						}
					} else if (character === "}" && sectionBracesDepth > 0) {
						sectionBracesDepth--;
						if (sectionBracesDepth === 0) {
							currentMathRange.setEnd(elements.textInput.firstChild, currentCharIndex + 1);
							CSS.highlights?.get("math").add(currentMathRange);
							currentMathRange = undefined;
						}
					}
				}

				backslashEscaped = false;
				if (character === "\\" && !codeMode) {
					backslashEscaped = true;
				}

				currentCharIndex += character.length;
			}
			currentSectionArray.push(stringSection);
			if ((sectionBracesDepth === 0 && !codeMode) || index === initialStringSections.length - 1) {
				sectionsArray.push({ string: currentSectionArray.join("\n") });
				currentSectionArray = [];
			}
			++currentCharIndex;
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
						elements.htmlOutput.children[index].replaceWith(div);
					} else console.error("Error: This should never happen");
				}
			}
		}

		if (CSS.highlights) {
			const highlight = CSS.highlights.get("heading");
			highlight.clear();
			for (const { 1: { length }, index } of textContent.matchAll(/^(#.*)$/gm)) {
				const range = new StaticRange({
					startContainer: elements.textInput.firstChild,
					startOffset: index,
					endContainer: elements.textInput.firstChild,
					endOffset: index + length,
				});
				highlight.add(range);
			}
		}

		previousSectionsArray = sectionsArray;
	};

	elements.textInput.addEventListener("input", handleInput);

	elements.textInput.addEventListener("beforeinput", (event) => {
		if (!event.inputType.startsWith("format")) {
			const [{ startContainer: container, startOffset, endOffset }] = event.getTargetRanges();
			const replaceText = (text: string) => {
				container.replaceData(startOffset, endOffset - startOffset, text);
				selection.collapse(container, startOffset + text.length);
				const { top } = selection.getRangeAt(0).getBoundingClientRect();
				const bottomEdge = elements.textInput.offsetTop + elements.textInput.offsetHeight;
				if (top > bottomEdge) elements.textInput.scrollBy(0, top - bottomEdge);
			};
			if (event.inputType === "insertParagraph") {
				event.preventDefault();
				replaceText("\n");
				handleInput();
			} else if (event.dataTransfer) {
				event.preventDefault();
				const insertedText = event.dataTransfer.getData("text/plain").replaceAll("\r", "");
				replaceText(insertedText);
				handleInput();
			} else return;
		}

		event.preventDefault();
		handleInput();
	});

	for (const element of [elements.textInput, elements.htmlOutput]) {
		let zoom = 1;
		element.addEventListener("wheel", (event) => {
			if (event.ctrlKey) {
				event.preventDefault();
				zoom *= (1 - Math.sqrt(Math.abs(event.deltaY)) * Math.sign(event.deltaY) / 100);
				element.style.setProperty("--zoom", zoom);
			}
		}, { passive: false });
		element.addEventListener("keydown", (event) => {
			if (event.ctrlKey && event.key === "0") {
				event.preventDefault();
				zoom = 1;
				element.style.setProperty("--zoom", zoom);
			}
		});
	}

	return () => {
		previousSectionsArray = [];

		for (const element of $$(":scope > .section", elements.htmlOutput)) {
			element.remove();
		}

		handleInput.call(elements.textInput);

		document.documentElement.classList.remove("file-dirty");
	};
})();

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

	// window.addEventListener("keyup", (event) => {
	// 	if (event.key === "Shift" && onlyShiftPressed) {
	// 		onlyShiftPressed = false;
	// 		const { value, selectionStart, selectionEnd } = elements.textInput;
	// 		if (value.slice(selectionStart, selectionStart + 2) === " }") {
	// 			elements.textInput.selectionStart = elements.textInput.selectionEnd = selectionStart + 2;
	// 		} else {
	// 			elements.textInput.value = value.slice(0, selectionStart) + "{  }" + value.slice(selectionEnd);
	// 			elements.textInput.selectionStart = elements.textInput.selectionEnd = selectionStart + 2;
	// 		}
	// 	}
	// });
}

