

import categorizeArray, { characterCategories } from "./categorizeArray.js";

export const categories = new class {
	number = "number";
	variable = "variable";
	keyword = "keyword";
	operator = "operator";
	anyOpeningBracket = "anyOpeningBracket";
	anyClosingBracket = "anyClosingBracket";
	whitespace = "whitespace";
};

export const operators = new class {
	plus = "plus";
	minus = "minus";
	times = "times";
	fraction = "fraction";
	divide = "divide";
	power = "power";
	root = "root";
	squareRoot = "squareRoot";
	invisibleTimes = "invisibleTimes";
	index = "index";
	equals = "equals";
};

const operatorSyntaxes = [
	{
		syntax: "+",
		name: operators.plus,
	},
	{
		syntax: "-",
		name: operators.minus,
	},
	{
		syntax: "*",
		name: operators.times,
	},
	{
		syntax: "/",
		name: operators.fraction,
	},
	{
		syntax: "//",
		name: operators.divide,
	},
	{
		syntax: "**",
		name: operators.power,
	},
	{
		syntax: "#",
		name: operators.root,
	},
	{
		syntax: "_",
		name: operators.index,
	},
	{
		syntax: "=",
		name: operators.equals,
	},
];

export const allBrackets = new class {
	openingParenthesis = "openingParenthesis";
	closingParenthesis = "closingParenthesis";
	openingBracket = "openingBracket";
	closingBracket = "closingBracket";
	openingBrace = "openingBrace";
	closingBrace = "closingBrace";
	openingGroup = "openingGroup";
	closingGroup = "closingGroup";
};

const allBracketsSyntaxes = [
	{
		syntax: "(",
		name: allBrackets.openingParenthesis,
	},
	{
		syntax: ")",
		name: allBrackets.closingParenthesis,
	},
	{
		syntax: "[",
		name: allBrackets.openingBracket,
	},
	{
		syntax: "]",
		name: allBrackets.closingBracket,
	},
	{
		syntax: "{",
		name: allBrackets.openingBrace,
	},
	{
		syntax: "}",
		name: allBrackets.closingBrace,
	},
];

const keywordNames = new class {
	sine = "sine";
	cosine = "cosine";
	pi = "pi";
};

const keywords = [
	{
		keyword: "sin",
		name: keywordNames.sine,
	},
	{
		keyword: "cos",
		name: keywordNames.cosine,
	},
	{
		keyword: "pi",
		name: keywordNames.pi,
	},
];

export default (/** @type {string} */ mathString) => {
	const categorizedArray = categorizeArray(mathString);

	let /** @type {any[]} */ mathArray = [];

	for (const [index, { characterCategory, string }] of categorizedArray.entries()) {
		if (characterCategory === characterCategories.number) {

			mathArray.push({
				category: characterCategories.number,
				string,
			});

		} else if (characterCategory === characterCategories.letters) {

			if ([characterCategories.number, characterCategories.anyClosingBracket].includes(categorizedArray[index - 1]?.characterCategory)) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}

			const keyword = keywords.find(({ keyword }) => string === keyword)?.name;

			if (keyword) {
				mathArray.push({
					category: categories.keyword,
					name: keyword,
				});

			} else {

				for (const [characterIndex, character] of string.split("").entries()) {

					if (characterIndex > 0) {
						mathArray.push({
							category: categories.operator,
							name: operators.invisibleTimes,
						});
					}

					mathArray.push({
						category: categories.variable,
						string: character,
					});
				}
			}

		} else if (characterCategory === characterCategories.symbols) {

			const operator = operatorSyntaxes.find(({ syntax }) => string === syntax).name;

			mathArray.push({
				category: categories.operator,
				name: operator,
				groupsNotMatched: true,
			});

			// if (![operators.power, operators.root].includes(operator)) {
			// 	while (groupParenthesesDepths.at(-1) <= 0) {
			// 		groupParenthesesDepths.pop();
			// 		mathArray.push({
			// 			category: categories.anyClosingBracket,
			// 			name: allBrackets.closingGroup,
			// 		});
			// 	}
			// }

			// if (operator === operators.root) {
			// 	if ([characterCategories.anyOpeningBracket, characterCategories.symbols, characterCategories.whitespace].includes(categorizedArray[index - 1]?.characterCategory)) {
			// 		mathArray.push({
			// 			category: categories.operator,
			// 			name: operators.squareRoot,
			// 		});
			// 	} else {
			// 		let rootParenthesisDepth = 0;
			// 		let i = index;

			// 		do {
			// 			i--;

			// 			if (categorizedArray[i].characterCategory === characterCategories.anyClosingBracket) {
			// 				rootParenthesisDepth++;
			// 			} else if (categorizedArray[i].characterCategory === characterCategories.anyOpeningBracket) {
			// 				rootParenthesisDepth--;
			// 			}
			// 		} while (
			// 			i >= 0
			// 			&&
			// 			(
			// 				rootParenthesisDepth > 0
			// 				||
			// 				[characterCategories.anyClosingBracket, characterCategories.number, characterCategories.letters].includes(categorizedArray[i].characterCategory)
			// 			)
			// 		);

			// 		mathArray.splice(i, 0, {
			// 			category: characterCategories.anyOpeningBracket,
			// 			name: allBrackets.openingGroup,
			// 		});

			// 		mathArray.push({
			// 			category: categories.anyClosingBracket,
			// 			name: allBrackets.closingGroup,
			// 		});

			// 		mathArray.push({
			// 			category: categories.operator,
			// 			name: operators.root,
			// 		});
			// 	}

			// 	mathArray.push({
			// 		category: categories.anyOpeningBracket,
			// 		name: allBrackets.openingGroup,
			// 	});
			// 	groupParenthesesDepths.push(0);

			// } else {
			// 	mathArray.push({
			// 		category: categories.operator,
			// 		name: operator,
			// 	});
			// }

			// if (operator === operators.power) {
			// 	mathArray.push({
			// 		category: categories.anyOpeningBracket,
			// 		name: allBrackets.openingGroup,
			// 	});
			// 	groupParenthesesDepths.push(0);
			// }

		} else if (characterCategory === characterCategories.anyOpeningBracket) {

			const bracket = allBracketsSyntaxes.find(({ syntax }) => string === syntax).name;

			if ([characterCategories.number, characterCategories.letters].includes(categorizedArray[index - 1]?.characterCategory)) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}

			// while (groupParenthesesDepths.at(-1) <= 0) {
			// 	groupParenthesesDepths.pop();
			// 	mathArray.push({
			// 		category: categories.anyClosingBracket,
			// 		name: allBrackets.closingGroup,
			// 	});
			// }

			// if (groupParenthesesDepths.length > 0) {
			// 	if (bracket === allBrackets.openingParenthesis) {
			// 		groupParenthesesDepths[groupParenthesesDepths.length - 1]++;
			// 	} else if (bracket === allBrackets.closingParenthesis) {
			// 		groupParenthesesDepths[groupParenthesesDepths.length - 1]--;
			// 	}
			// }

			mathArray.push({
				category: categories.anyOpeningBracket,
				name: bracket,
			});

		} else if (characterCategory === characterCategories.anyClosingBracket) {

			const bracket = allBracketsSyntaxes.find(({ syntax }) => string === syntax).name;

			mathArray.push({
				category: categories.anyClosingBracket,
				name: bracket,
			});

		} else if (characterCategory === characterCategories.whitespace) {

			mathArray.push({
				category: categories.whitespace,
			});

			// while (groupParenthesesDepths.at(-1) <= 0) {
			// 	groupParenthesesDepths.pop();
			// 	mathArray.push({
			// 		category: categories.anyClosingBracket,
			// 		name: allBrackets.closingGroup,
			// 	});
			// }

			if (
				[categorizedArray[index - 1], categorizedArray[index + 1]].every(({ characterCategory, string } = {}, i) => (
					[characterCategories.number, characterCategories.letters].includes(characterCategory)
					||
					string === [")", "("][i]
				))
			) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}
		}
	}

	{
		const matchGroup = (/** @type {{ index: number, direction: "forwards" | "backwards", disallowedOperators?: string[]}} */ {
			index: startIndex,
			direction: directionString,
			disallowedOperators = [],
		}) => {
			let parenthesesDepth = 0;
			const direction = directionString === "forwards" ? 1 : -1;

			if (mathArray[startIndex + direction].category === categories.whitespace) {
				startIndex += direction;
			}

			let index = startIndex;
			let parenthesizedExpression = true;

			// index += direction;

			do {
				// index += direction;

				index += direction;

				if (mathArray[index]?.category === categories.anyOpeningBracket) {
					if (index !== startIndex + direction && parenthesesDepth <= 0) {
						parenthesizedExpression = false;
					}
					parenthesesDepth += direction;
				} else if (mathArray[index]?.category === categories.anyClosingBracket) {
					parenthesesDepth -= direction;
				}

			} while (
				index < mathArray.length
				&&
				index >= 0
				&&
				parenthesesDepth >= 0
				&&
				(
					parenthesesDepth > 0
					||
					(
						mathArray[index].category !== categories.whitespace
						&&
						!(mathArray[index].category === categories.operator && disallowedOperators.includes(mathArray[index].name))
					)
				)
			)

			if (parenthesizedExpression && Math.abs(index - startIndex) > 2 && [categories.anyOpeningBracket, categories.anyClosingBracket].includes(mathArray[index - direction]?.category)) {
				if (directionString === "forwards") {
					mathArray.splice(index - 1, 1);
					mathArray.splice(startIndex + 1, 1);
					index -= 2;
				} else {
					mathArray.splice(startIndex - 1, 1);
					mathArray.splice(index + 1, 1);
					startIndex -= 2;
				};
			}

			if (directionString === "forwards") {
				mathArray.splice(index, 0, {
					category: categories.anyClosingBracket,
					name: allBrackets.closingGroup,
				});
				mathArray.splice(startIndex + 1, 0, {
					category: categories.anyOpeningBracket,
					name: allBrackets.openingGroup,
				});
			} else {
				mathArray.splice(startIndex, 0, {
					category: categories.anyClosingBracket,
					name: allBrackets.closingGroup,
				});
				mathArray.splice(index + 1, 0, {
					category: categories.anyOpeningBracket,
					name: allBrackets.openingGroup,
				});
			}
		}

		{
			let /** @type {number} */ index;

			while (index = mathArray.findIndex(
				({ category, groupsNotMatched }) => category === categories.operator && groupsNotMatched
			), index >= 0) {

				const operator = mathArray[index].name;
				delete mathArray[index].groupsNotMatched;

				if (operator === operators.fraction) {

					matchGroup({
						index: index,
						direction: "forwards",
						disallowedOperators: [operators.fraction],
					});
					matchGroup({
						index: index,
						direction: "backwards",
					});

				} else if (operator === operators.power) {

					matchGroup({
						index: index,
						direction: "forwards",
					});
					matchGroup({
						index: index,
						direction: "backwards",
						disallowedOperators: [
							operators.plus,
							operators.minus,
							operators.times,
							operators.fraction,
							operators.divide,
							operators.power,
							operators.root,
							operators.squareRoot,
							operators.invisibleTimes,
						],
					});

				} else if (operator === operators.root) {

					if ([characterCategories.anyOpeningBracket, characterCategories.symbols, characterCategories.whitespace].includes(mathArray[index - 1]?.category)) {

						mathArray[index].name = operators.squareRoot;

						matchGroup({
							index: index,
							direction: "forwards",
						});

						if (mathArray[index + 1]?.category === characterCategories.whitespace) {
							mathArray.splice(index, 0, {
								category: categories.operator,
								name: operators.invisibleTimes,
							});
						}

					} else {

						matchGroup({
							index: index,
							direction: "forwards",
						});
						matchGroup({
							index: index,
							direction: "backwards",
						});
					}
				} else if (operator === operators.index) {

					matchGroup({
						index: index,
						direction: "forwards",
					});
					matchGroup({
						index: index,
						direction: "backwards",
						disallowedOperators: [
							operators.plus,
							operators.minus,
							operators.times,
							operators.fraction,
							operators.divide,
							operators.power,
							operators.root,
							operators.squareRoot,
							operators.invisibleTimes,
						],
					});
				}
			}
		}
	}

	mathArray = mathArray.filter(({ category }) => category !== categories.whitespace);

	return mathArray;
};
