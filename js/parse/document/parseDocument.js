
import parseMath from "../math/parseMath.js";

export default (/** @type {string} */ inputString) => {
	let currentString = "\n";
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

	const flattenStack = () => {
		while (stack.length >= 2) {
			stack.at(-2).content.push(stack.pop());
		}
		for (const formattingType in currentTextFormatting) {
			currentTextFormatting[formattingType] = false;
		}
	};

	$loop: for (const character of inputString) {

		if (currentType === "headingMarker") {
			if (character !== "#") {
				stack.push({
					type: "heading",
					headingLevel: currentString.length,
					content: [],
				});
				currentString = "";
				currentType = "text";
				if (character === " ") {
					continue $loop;
				}
			}
		}

		if (character === "{") {
			if (currentType !== "math" && !/^\{*$/.test(currentString)) {
				const displayBlock = /^\n+$/.test(currentString);
				if (displayBlock) {
					flattenStack();
				} else {
					stack.at(-1).content.push({
						type: "text",
						string: currentString,
					});
				}
				stack.push({
					type: "math",
					content: [],
					displayBlock,
					displayStyle: displayBlock,
					bracesDepth: null,
				});
				currentString = "";
				currentType = "mathStart";
			}
			bracesDepth++;
		} else {
			if (currentType === "mathStart") {
				stack.at(-1).bracesDepth = bracesDepth;
				if (bracesDepth === 2) {
					stack.at(-1).displayStyle = !stack.at(-1).displayBlock;
				}
				currentString = "";
				currentType = "math";
			}

			if (character === "}" && bracesDepth > 0) {
				if (bracesDepth === stack.at(-1).bracesDepth) {
					stack.at(-1).content.push(...parseMath(currentString));
					stack.at(-2).content.push(stack.pop());
					currentString = "";
					currentType = "mathEnd";
					bracesDepth--;
					continue $loop;
				}
				bracesDepth--;
			} else {
				if (currentType === "mathEnd") {
					currentType = "text";
					currentString = "";
				}
				if (currentType === "text") {
					if (character === "\n") {
						if (currentString === "\n") {
							flattenStack();
							continue $loop;
						} else if (stack[1]?.type === "heading") {
							stack.at(-1).content.push({
								type: "text",
								string: currentString,
							});
							flattenStack();
						} else if (currentString) {
							stack.at(-1).content.push({
								type: "text",
								string: currentString,
							});
						}
						currentString = "";
						currentType = "text";
					} else if (character === "#" && /^\n+$/.test(currentString)) {
						flattenStack();
						currentType = "headingMarker";
						currentString = "";
					} else {
						if (currentString === "\n") {
							if (stack.length > 1) {
								stack.at(-1).content.push({
									type: "newLine",
								});
							} else {
								flattenStack();
								stack.push({
									type: "paragraph",
									content: [],
								});
							}
							currentString = "";
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
				}
			}
		}
		currentString += character;
	}

	if (currentType === "math") {
		stack.at(-1).content.push(...parseMath(currentString));
	} else if (currentType !== "mathEnd") {
		stack.at(-1).content.push({
			type: currentType,
			string: currentString,
		});
	}

	flattenStack();

	return stack[0].content;
};

