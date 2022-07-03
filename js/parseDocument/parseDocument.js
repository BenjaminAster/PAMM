
import parseMath from "./math/parseMath.js";

export default (/** @type {string} */ inputString) => {
	const documentTree = createDocumentTree(inputString);
	const fragment = createDocument(documentTree);
	return fragment;
};

const createDocumentTree = (/** @type {string} */ inputString) => {
	inputString += " ";
	let currentString = "";
	let stack = [{
		type: "base",
		content: [],
	}];
	let bracesDepth = 0;
	let currentType = "text";
	let currentTextFormatting = {
		bold: false,
		italic: false,
	};

	$loop: for (const [i, character] of [...inputString].entries()) {
		if (character === "{") {
			bracesDepth++;
			if (bracesDepth === 1) {
				stack.at(-1).content.push({
					type: "text",
					string: currentString,
				});
				currentString = "";
				currentType = "math";
				continue $loop;
			}
		} else if (character === "}" && bracesDepth > 0) {
			bracesDepth--;
			if (bracesDepth === 0) {
				stack.at(-1).content.push({
					type: "math",
					string: currentString,
				});
				currentString = "";
				currentType = "text";
				continue $loop;
			}
		} else if (currentType === "text") {
			if (character === "\n") {
				stack.at(-1).content.push({
					type: "text",
					string: currentString,
				});
				stack.at(-1).content.push({
					type: "newLine",
				});
				currentString = "";
				currentType = "text";
				continue $loop;
			}
			$characterLoop: for (const [formattingCharacter, formattingType] of [["*", "bold"], ["_", "italic"]]) {
				if (formattingCharacter === character) {
					if (!currentTextFormatting[formattingType]) {
						stack.at(-1).content.push({
							type: "text",
							string: currentString,
						});
						stack.push({
							type: formattingType,
							content: [],
						});
						currentString = "";
						currentTextFormatting[formattingType] = true;
						continue $loop;
					} else if (stack.at(-1).type === formattingType) {
						stack.at(-1).content.push({
							type: "text",
							string: currentString,
						});
						stack.at(-2).content.push(stack.pop());
						currentTextFormatting[formattingType] = false;
						currentString = "";
						continue $loop;
					}
					break $characterLoop;
				}
			}
		}
		currentString += character;

		if (i === [...inputString].length - 1) {
			stack.at(-1).content.push({
				type: "text",
				string: currentString,
			});
		}
	}

	return stack[0].content;
};


const createDocument = (/** @type {any[]} */ documentTree) => {

	const recursiveRender = (/** @type {any[]} */ tree) => {
		const fragment = new DocumentFragment();

		for (const item of tree) {
			if (item.type === "text") {
				fragment.append(document.createTextNode(item.string))
			} else if (item.type === "math") {
				const mathElement = document.createElement("math");
				mathElement.append(parseMath(item.string));
				fragment.append(mathElement);
			} else if (item.type === "newLine") {
				const lineBreakElement = document.createElement("br");
				fragment.append(lineBreakElement);
			} else if (item.type === "bold") {
				const boldElement = document.createElement("strong");
				boldElement.append(recursiveRender(item.content))
				fragment.append(boldElement);
			} else if (item.type === "italic") {
				const boldElement = document.createElement("em");
				boldElement.append(recursiveRender(item.content))
				fragment.append(boldElement);
			}
		}

		return fragment;
	};

	return recursiveRender(documentTree);
};
