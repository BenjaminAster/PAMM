
import arrayToTree from "./arrayToTree.js";
import categorizeArray, { categories, characterCategories, keywords, operators, operatorSyntaxes, allBracketsSyntaxes, allBrackets } from "./categorizeArray.js";


export default (/** @type {string} */ mathString) => {

	// console.time("parseMath");

	const categorizedArray = categorizeArray(mathString);

	// console.timeLog("parseMath");

	let /** @type {any[]} */ mathArray = [];

	for (const [index, { characterCategory, string, ...itemProperties }] of categorizedArray.entries()) {
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

			// const operator = operatorSyntaxes.find(({ syntax }) => string === syntax).name;

			// mathArray.push({
			// 	category: categories.operator,
			// 	name: operator,
			// 	groupsNotMatched: true,
			// });

			// mathArray.push(...categorizeSymbols(string).map(({ operator }) => ({
			// 	category: categories.operator,
			// 	name: operator,
			// 	groupsNotMatched: true,
			// })));

			mathArray.push({
				category: categories.operator,
				name: itemProperties.operator,
				groupsNotMatched: true,
			});

		} else if (characterCategory === characterCategories.anyOpeningBracket) {

			const bracket = allBracketsSyntaxes.find(({ syntax }) => string === syntax).name;

			if ([characterCategories.number, characterCategories.letters].includes(categorizedArray[index - 1]?.characterCategory)) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}

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
		const matchGroup = (/** @type {{ index: number, direction: "forwards" | "backwards", removeRedundantParentheses?: boolean, disallowedOperators?: string[]}} */ {
			index: startIndex,
			direction: directionString,
			removeRedundantParentheses = true,
			disallowedOperators = [],
		}) => {
			let parenthesesDepth = 0;
			const direction = (directionString === "forwards") ? 1 : -1;

			if (mathArray[startIndex + direction].category === categories.whitespace) {
				startIndex += direction;
			}

			let index = startIndex;
			let parenthesizedExpression = true;

			do {
				index += direction;

				if (mathArray[index]?.category === {
					"forwards": categories.anyOpeningBracket,
					"backwards": categories.anyClosingBracket,
				}[directionString] && index !== startIndex + direction && parenthesesDepth <= 0) {
					parenthesizedExpression = false;
				}

				if (mathArray[index]?.category === categories.anyOpeningBracket) {
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
			);

			if (
				removeRedundantParentheses
				&&
				parenthesizedExpression
				&&
				Math.abs(index - startIndex) > 2
				&&
				[categories.anyOpeningBracket, categories.anyClosingBracket].includes(mathArray[index - direction]?.category)
			) {
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
					name: allBrackets.group,
				});
				mathArray.splice(startIndex + 1, 0, {
					category: categories.anyOpeningBracket,
					name: allBrackets.group,
				});
			} else {
				mathArray.splice(startIndex, 0, {
					category: categories.anyClosingBracket,
					name: allBrackets.group,
				});
				mathArray.splice(index + 1, 0, {
					category: categories.anyOpeningBracket,
					name: allBrackets.group,
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
						removeRedundantParentheses: false,
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

				} else if (operator === operators.square) {

					matchGroup({
						index: index,
						direction: "backwards",
						removeRedundantParentheses: false,
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

				} else if (operator === operators.factorial) {

					matchGroup({
						index: index,
						direction: "backwards",
						removeRedundantParentheses: false,
						disallowedOperators: [
							operators.plus,
							operators.minus,
							operators.times,
							operators.divide,
							operators.power,
							operators.invisibleTimes,
						],
					});

				} else if (operator === operators.root) {

					if ([categories.anyOpeningBracket, categories.operator, categories.whitespace].includes(mathArray[index - 1]?.category)) {

						mathArray[index].name = operators.squareRoot;

						matchGroup({
							index: index,
							direction: "forwards",
						});

						if (mathArray[index - 1]?.category === characterCategories.whitespace) {
							if ([categories.anyClosingBracket, categories.keyword, categories.variable, categories.number].includes(mathArray[index - 2]?.category)) {

								mathArray.splice(index, 0, {
									category: categories.operator,
									name: operators.invisibleTimes,
								});
							}
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

	const tree = arrayToTree(mathArray);

	return tree;
};