
import { categories, operators } from "./categorizeArray.js";

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

const matchGroups = (/** @type {any[]} */ mathArray) => {
	const stack = [{
		type: "base",
		content: [],
	}];

	for (const item of mathArray) {
		if (item.category === categories.anyOpeningBracket) {
			stack.push({
				type: item.name,
				content: [],
			});
		} else if (item.category === categories.anyClosingBracket) {
			let /** @type {string} */ previousGroupType;
			while (stack.length >= 2 && previousGroupType !== item.name) {
				previousGroupType = stack.at(-1).type;
				stack.at(-2).content.push(stack.pop());
			}
		} else {
			stack.at(-1).content.push({
				...item,
				type: "item",
			});
		}
	}

	return stack[0].content;
};

export default (/** @type {any[]} */ mathArray) => {

	const groupsTree = matchGroups(mathArray);

	const recursiveTree = (/** @type {any[]} */ tree) => {
		const newTree = [];

		$loop: for (let index = 0; index < tree?.length; index++) {
			const item = tree[index];

			if (tree[index + 1]?.category === categories.operator) {
				if ([...operatorsWithItemBeforeAndAfter, ...operatorsWithItemBefore].includes(tree[index + 1]?.name)) {
					continue $loop;
				}
			}

			if (item.category === categories.operator) {
				if (operatorsWithItemBefore.includes(item.name)) {
					if (item.name === operators.square) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							base: recursiveTree(tree[index - 1]?.content),
						});
					} else if (item.name === operators.factorial) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							expression: recursiveTree(tree[index - 1]?.content),
						});
					}

					continue $loop;
				} else if (operatorsWithItemBeforeAndAfter.includes(item.name)) {
					if (item.name === operators.fraction) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							numerator: recursiveTree(tree[index - 1]?.content),
							denominator: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.power) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							base: recursiveTree(tree[index - 1]?.content),
							exponent: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.index) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							base: recursiveTree(tree[index - 1]?.content),
							index: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.root) {
						newTree.push({
							category: categories.operator,
							name: item.name,
							degree: recursiveTree(tree[index - 1]?.content),
							radicand: recursiveTree(tree[index + 1]?.content),
						});
					}

					index++;
					continue $loop;
				} else if (operatorsWithItemAfter.includes(item.name)) {
					if (item.name === operators.squareRoot) {
						newTree.push({
							category: categories.operator,
							name: operators.squareRoot,
							radicand: recursiveTree(tree[index + 1]?.content),
						});
					}

					index++;
					continue $loop;
				}
			}

			if (item.type === "item") {
				delete item.type;
				newTree.push(item);
			} else {
				newTree.push({
					category: categories.anyBracket,
					name: item.type,
					content: recursiveTree(item.content),
				});
			}
		}

		return newTree;
	};

	return recursiveTree(groupsTree);
};
