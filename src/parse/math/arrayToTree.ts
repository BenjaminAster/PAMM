
import { categories, keywords, keywordTypes, operators } from "../../constants.ts";

const operatorsWithItemBeforeAndAfter = [
	operators.fraction,
	operators.power,
	operators.index,
	operators.root,
];

const operatorsWithItemBefore = [
	operators.square,
	operators.factorial,
];

const operatorsWithItemAfter = [
	operators.squareRoot,
];

const matchAnyBrackets = (mathArray: any[]) => {
	const stack = [{
		type: "base",
		contents: [[] as any[]],
	}];

	for (const item of mathArray) {
		if (item.category === categories.anyOpeningBracket) {
			stack.push({
				type: item.anyBracketType,
				contents: [[]],
			});
		} else if (item.category === categories.anyClosingBracket) {
			let previousGroupType: string;
			while (stack.length >= 2 && previousGroupType !== item.anyBracketType) {
				previousGroupType = stack.at(-1).type;
				stack.at(-2).contents.at(-1).push(stack.pop());
			}
		} else if (item.category === categories.operator && item.operator === operators.comma) {
			stack.at(-1).contents.push([]);
		} else {
			stack.at(-1).contents.at(-1).push({
				...item,
				type: "item",
			});
		}
	}

	while (stack.length >= 2) {
		stack.at(-2).contents.at(-1).push(stack.pop());
	}

	return stack[0].contents;
};

export default (mathArray: any[]) => {

	const groupedTree = matchAnyBrackets(mathArray);

	const recursiveTree = (tree: any[]): any[] => {
		const newTree = [];

		for (const expression of tree) {
			newTree.push([]);

			$itemLoop: for (let itemIndex = 0; itemIndex < expression?.length; itemIndex++) {
				const item = expression[itemIndex];

				if (expression[itemIndex + 1]?.category === categories.operator) {
					if ([...operatorsWithItemBeforeAndAfter, ...operatorsWithItemBefore].includes(expression[itemIndex + 1]?.operator)) {
						continue $itemLoop;
					}
				}

				if (item.category === categories.operator) {
					if (operatorsWithItemBefore.includes(item.operator)) {
						if (item.operator === operators.square) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: operators.power,
								base: recursiveTree(expression[itemIndex - 1]?.contents),
								exponent: [[{
									category: categories.number,
									number: "2",
									type: "item",
								}]],
							});
						} else if (item.operator === operators.factorial) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: item.operator,
								expression: recursiveTree(expression[itemIndex - 1]?.contents),
							});
						}

						continue $itemLoop;
					} else if (operatorsWithItemBeforeAndAfter.includes(item.operator)) {
						if (item.operator === operators.fraction) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: item.operator,
								numerator: recursiveTree(expression[itemIndex - 1]?.contents),
								denominator: recursiveTree(expression[itemIndex + 1]?.contents),
							});
						} else if (item.operator === operators.power) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: item.operator,
								base: recursiveTree(expression[itemIndex - 1]?.contents),
								exponent: recursiveTree(expression[itemIndex + 1]?.contents),
							});
						} else if (item.operator === operators.index) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: item.operator,
								base: recursiveTree(expression[itemIndex - 1]?.contents),
								index: recursiveTree(expression[itemIndex + 1]?.contents),
							});
						} else if (item.operator === operators.root) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: item.operator,
								degree: recursiveTree(expression[itemIndex - 1]?.contents),
								radicand: recursiveTree(expression[itemIndex + 1]?.contents),
							});
						}

						itemIndex++;
						continue $itemLoop;
					} else if (operatorsWithItemAfter.includes(item.operator)) {
						if (item.operator === operators.squareRoot) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: operators.squareRoot,
								radicand: recursiveTree(expression[itemIndex + 1]?.contents),
							});
						}

						itemIndex++;
						continue $itemLoop;
					}
				} else if (item.category === categories.function) {
					newTree.at(-1).push({
						category: categories.function,
						functionName: item.functionName,
						parameters: recursiveTree(expression[itemIndex + 1]?.contents),
					});
					itemIndex++;
					continue $itemLoop;
				} else if (item.category === categories.keyword) {
					if (item.keywordType === keywordTypes.function) {
						if (item.keywordName === keywords.sum) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: operators.sum,
								startExpression: recursiveTree([expression[itemIndex + 1]?.contents?.[0] ?? []]),
								endExpression: recursiveTree([expression[itemIndex + 1]?.contents?.[1] ?? []]),
								expression: recursiveTree([expression[itemIndex + 1]?.contents?.[2] ?? []]),
							});
							itemIndex++;
							continue $itemLoop;
						} else if (item.keywordName === keywords.integral) {
							newTree.at(-1).push({
								category: categories.operator,
								operator: operators.integral,
								lowerLimit: recursiveTree([expression[itemIndex + 1]?.contents?.[0] ?? []]),
								upperLimit: recursiveTree([expression[itemIndex + 1]?.contents?.[1] ?? []]),
								integrand: recursiveTree([expression[itemIndex + 1]?.contents?.[2] ?? []]),
								integrationVariable: recursiveTree([expression[itemIndex + 1]?.contents?.[3] ?? [{
									category: categories.variable,
									type: "item",
									variable: "x",
								}]]),
							});
							itemIndex++;
							continue $itemLoop;
						}
					}
				}

				if (item.type === "item") {
					delete item.type;
					newTree.at(-1).push(item);
				} else {
					newTree.at(-1).push({
						category: categories.anyBracket,
						anyBracketType: item.type,
						content: recursiveTree(item.contents),
					});
				}
			}
		}

		return newTree;
	};

	const tree = recursiveTree(groupedTree);

	return tree;
};
