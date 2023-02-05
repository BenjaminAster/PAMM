
import arrayToTree from "./arrayToTree.js";
import categorizeArray, { categories, characterCategories, keywordList, operators, operatorList, allBracketsSyntaxes, allBrackets } from "./categorizeArray.js";


export default (/** @type {string} */ mathString) => {

	let mathArray = categorizeArray(mathString);

	{
		const matchGroup = (/** @type {{ index: number, direction: "forwards" | "backwards", removeRedundantParentheses?: boolean, disallowedOperators?: string[], canBehaveLikeFunction?: boolean }} */ {
			index: startIndex,
			direction: directionString,
			removeRedundantParentheses = true,
			disallowedOperators = [],
			canBehaveLikeFunction = false,
		}) => {
			let parenthesesDepth = 0;
			const direction = (directionString === "forwards") ? 1 : -1;

			if (mathArray[startIndex + direction]?.category === categories.whitespace) {
				startIndex += direction;
			}

			let index = startIndex;
			let parenthesizedExpression = true;
			let functionLike = false;

			do {
				index += direction;

				if (parenthesesDepth <= 0 && mathArray[index]?.category === {
					"forwards": categories.anyOpeningBracket,
					"backwards": categories.anyClosingBracket,
				}[directionString]) {
					if (index === startIndex + direction) {
						if (canBehaveLikeFunction) {
							functionLike = true;
						}
					} else {
						parenthesizedExpression = false;
					}
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
						!functionLike
						&&
						mathArray[index].category !== categories.whitespace
						&&
						!(
							mathArray[index].category === categories.operator
							&&
							[...disallowedOperators, operators.comma, operators.semicolon].includes(mathArray[index].operator)
						)
					)
				)
			);

			if (functionLike) {
				index++;
			}

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
					anyBracketType: allBrackets.group,
				});
				mathArray.splice(startIndex + 1, 0, {
					category: categories.anyOpeningBracket,
					anyBracketType: allBrackets.group,
				});
			} else {
				mathArray.splice(startIndex, 0, {
					category: categories.anyClosingBracket,
					anyBracketType: allBrackets.group,
				});
				mathArray.splice(index + 1, 0, {
					category: categories.anyOpeningBracket,
					anyBracketType: allBrackets.group,
				});
			}
		}

		{
			let /** @type {number} */ index;

			while (index = mathArray.findIndex(
				({ category, groupsNotMatched }) => category === categories.operator && groupsNotMatched
			), index >= 0) {

				const operator = mathArray[index].operator;
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
						canBehaveLikeFunction: true,
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
							operators.colon,
							operators.power,
							operators.root,
							operators.squareRoot,
							operators.square,
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
							operators.colon,
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
							operators.colon,
							operators.power,
							operators.invisibleTimes,
						],
					});

				} else if (operator === operators.squareRoot) {

					matchGroup({
						index: index,
						direction: "forwards",
						canBehaveLikeFunction: true,
					});

					if (mathArray[index - 1]?.category === characterCategories.whitespace) {
						if ([categories.anyClosingBracket, categories.keyword, categories.variable, categories.number].includes(mathArray[index - 2]?.category)) {
							mathArray.splice(index, 0, {
								category: categories.operator,
								operator: operators.invisibleTimes,
							});
						}
					}

				} else if (operator === operators.root) {

					matchGroup({
						index: index,
						direction: "forwards",
						canBehaveLikeFunction: true,
					});
					matchGroup({
						index: index,
						direction: "backwards",
						canBehaveLikeFunction: true,
					});

				} else if (operator === operators.index) {

					matchGroup({
						index: index,
						direction: "forwards",
						canBehaveLikeFunction: true,
						disallowedOperators: [
							operators.power,
							operators.square,
						],
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
							operators.colon,
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
