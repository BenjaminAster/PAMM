
{
	// Promise.withResolvers() polyfill until browser support is better
	Promise.withResolvers ??= function () {
		let resolve, reject;
		let promise = new Promise((res, rej) => (resolve = res, reject = rej));
		return { promise, resolve, reject };
	};
}

import { elements, $$, storage, transition } from "./app.js";
import parseDocument from "./parse/document/parseDocument.js";
import renderDocument from "./render/document/renderDocument.js";
import { keyDown } from "./files.js";

export const { startRendering } = (() => {
	let previousSectionsArray = [];

	const handleInput = function (/** @type {Partial<InputEvent>} */ { data } = ({})) {
		const { value, selectionStart, selectionEnd } = this;

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

		const /** @type {any[]} */ sectionsArray = [];

		let sectionBracesDepth = 0;
		let currentSectionArray = [];
		// const initialStringSections = value.split(/(?:\n(?=(?:#|-?{)))|(?:(?:(?<=})|\n)\n(?!(?:\n|#)))/g);
		const initialStringSections = value.split(/\n(?!\n)/g);
		let codeMode = false;
		let backslashEscaped = false;
		for (let index = 0; index < initialStringSections.length; index++) {
			const stringSection = initialStringSections[index];
			for (const character of stringSection) {
				if (character === "`" && sectionBracesDepth === 0 && !backslashEscaped) {
					codeMode = !codeMode;
				}

				if (!codeMode && !backslashEscaped) {
					if (character === "{") {
						sectionBracesDepth++;
					} else if (character === "}" && sectionBracesDepth > 0) {
						sectionBracesDepth--;
					}
				}

				backslashEscaped = false;
				if (character === "\\" && !codeMode) {
					backslashEscaped = true;
				}
			}
			currentSectionArray.push(stringSection);
			if ((sectionBracesDepth === 0 && !codeMode) || index === initialStringSections.length - 1) {
				sectionsArray.push({ string: currentSectionArray.join("\n") });
				currentSectionArray = [];
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

	return {
		startRendering() {
			previousSectionsArray = [];

			for (const element of $$(":scope > .section", elements.htmlOutput)) {
				element.remove();
			}

			handleInput.call(elements.textInput);

			document.documentElement.classList.remove("file-dirty");
		},
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


{
	// horizontal / vertical layout
	const button = elements.toggleLayoutButton;
	let /** @type {EditorLayout} */ currentLayout = storage.get("editor-layout") ?? "aside";
	document.documentElement.dataset.editorLayout = currentLayout;
	button.addEventListener("click", async () => {
		currentLayout = currentLayout === "aside" ? "stacked" : "aside";
		await transition(async () => {
			document.documentElement.dataset.editorLayout = currentLayout;
		}, { name: "toggling-layout" });
		storage.set("editor-layout", currentLayout);
	});

	const editor = elements.editor;
	const dragger = editor.querySelector(".dragger");

	let dragging = false;
	let /** @type {number} */ relativeDraggerCoordinate;
	let /** @type {number} */ draggerSize;
	let /** @type {number} */ containerCoordinate;
	let /** @type {number} */ containerSize;

	dragger.addEventListener("mousedown", ({ clientX, clientY }) => {
		editor.classList.add("dragging");
		dragging = true;
		const stacked = currentLayout === "stacked";
		let /** @type {number} */ draggerCoordinate;
		({ [stacked ? "y" : "x"]: draggerCoordinate, [stacked ? "height" : "width"]: draggerSize } = dragger.getBoundingClientRect());
		relativeDraggerCoordinate = (stacked ? clientY : clientX) - draggerCoordinate;
		({ [stacked ? "y" : "x"]: containerCoordinate, [stacked ? "height" : "width"]: containerSize } = editor.getBoundingClientRect());
	});

	window.addEventListener("mouseup", () => {
		if (!dragging) return;
		editor.classList.remove("dragging");
		dragging = false;
	});

	window.addEventListener("mousemove", ({ clientX, clientY }) => {
		if (!dragging) return;
		const stacked = currentLayout === "stacked";
		const splitProportion = ((stacked ? clientY : clientX) - relativeDraggerCoordinate - containerCoordinate) / (containerSize - draggerSize);
		editor.style.setProperty("--split-proportion", splitProportion);
	});

	dragger.addEventListener("touchstart", (event) => {
		if (event.touches.length !== 1) return;
		dragger.dispatchEvent(new MouseEvent("mousedown", event.touches[0]))
	}, { passive: false });

	window.addEventListener("touchend", (event) => {
		if (event.touches.length !== 0) return;
		window.dispatchEvent(new MouseEvent("mouseup"))
	}, { passive: false });

	window.addEventListener("touchmove", (event) => {
		if (event.touches.length !== 1) return;
		window.dispatchEvent(new MouseEvent("mousemove", event.touches[0]))
	}, { passive: false });
}

