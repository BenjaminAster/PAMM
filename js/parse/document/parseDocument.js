
import parseMath from "../math/parseMath.js";

export default (/** @type {string} */ inputString) => {
	let currentString = "\n";
	let stack = [{
		type: "base",
		content: [],
	}];
	let bracesDepth = 0;
	let currentType = "text";
	let backslashEscaped = false;
	let currentTextFormatting = {
		bold: false,
		italic: false,
		underline: false,
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

		if (currentType === "code") {
			if (character === "`") {
				stack.at(-1).content.push({
					type: "text",
					string: currentString,
				});
				stack.at(-2).content.push(stack.pop());
				currentType = "text";
				currentString = "";
				continue $loop;
			}
		} else if (character === "{" && !backslashEscaped) {
			bracesDepth++;
			if (currentType !== "math") {
				const displayBlock = /^(?:\n|-)$/.test(currentString);
				const displayStyle = /^(?:\n|(?:.*\+)?)$/.test(currentString);

				if (displayBlock) {
					flattenStack();
				} else {
					if (currentString.endsWith("+")) {
						currentString = currentString.slice(0, -1);
					}
					stack.at(-1).content.push({
						type: "text",
						string: currentString,
					});
				}

				stack.push({
					type: "math",
					content: [],
					displayBlock,
					displayStyle,
				});
				currentString = "";
				currentType = "math";
				continue $loop;
			}
		} else if (character === "}" && bracesDepth > 0 && !backslashEscaped) {
			bracesDepth--;
			if (bracesDepth === 0 && currentType === "math") {
				stack.at(-1).content.push(...parseMath(currentString));
				stack.at(-2).content.push(stack.pop());
				currentString = "";
				currentType = "text";
				continue $loop;
			}
		} else if (currentType === "text") {
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
					if (stack.length === 1) {
						stack.push({
							type: "paragraph",
							content: [],
						});
					}
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
						if (character !== "-") {
							stack.push({
								type: "paragraph",
								content: [],
							});
						}
					}
					currentString = "";
				} else if (currentString === "-") {
					stack.push({
						type: "paragraph",
						content: [],
					});
				}

				if (character === "`" && !backslashEscaped) {
					stack.at(-1).content.push({
						type: "text",
						string: currentString,
					});
					stack.push({
						type: "code",
						content: [],
					});
					currentType = "code";
					currentString = "";
					continue $loop;
				}


				if (!backslashEscaped) {
					$characterLoop: for (const [formattingCharacter, formattingType] of [["*", "bold"], ["_", "italic"], ["^", "underline"]]) {
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

		if (backslashEscaped) {
			backslashEscaped = false;
		} else if (character === "\\" && currentType !== "code") {
			backslashEscaped = true;
			continue $loop;
		}

		currentString += character;
	}

	if (currentType === "math") {
		stack.at(-1).content.push(...parseMath(currentString));
	} else if (currentString === "\n") {
		stack.at(-1).bottomMargin = true;
	} else if (stack.length === 1) {
		stack.push({
			type: "paragraph",
			content: [{
				type: "text",
				string: currentString,
			}],
		});
	} else {
		stack.at(-1).content.push({
			type: currentType,
			string: currentString,
		});
	}

	flattenStack();

	return stack[0].content;
};

