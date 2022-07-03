
import matchGroups from "./matchGroups.js";

import { allBrackets, categories, operators } from "./stringToArray.js";

const operatorsWithItemBefore = [
	operators.fraction,
	operators.power,
	operators.index,
	operators.root,
];

const operatorsWithItemAfter = [
	operators.squareRoot,
];

export default (/** @type {any[]} */ mathArray) => {
	const groupsTree = matchGroups(mathArray);

	const recursiveTree = (/** @type {any[]} */ tree) => {
		const newTree = [];

		loop: for (let index = 0; index < tree?.length; index++) {
			const item = tree[index];

			if (tree[index + 1]?.category === categories.operator) {
				if (operatorsWithItemBefore.includes(tree[index + 1]?.name)) {
					continue loop;
				}
			}

			if (item.category === categories.operator) {
				if (operatorsWithItemBefore.includes(item.name)) {
					if (item.name === operators.fraction) {
						newTree.push({
							category: categories.operator,
							name: operators.fraction,
							numerator: recursiveTree(tree[index - 1]?.content),
							denominator: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.power) {
						newTree.push({
							category: categories.operator,
							name: operators.power,
							base: recursiveTree(tree[index - 1]?.content),
							exponent: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.index) {
						newTree.push({
							category: categories.operator,
							name: operators.index,
							base: recursiveTree(tree[index - 1]?.content),
							index: recursiveTree(tree[index + 1]?.content),
						});
					} else if (item.name === operators.root) {
						newTree.push({
							category: categories.operator,
							name: operators.root,
							degree: recursiveTree(tree[index - 1]?.content),
							radicand: recursiveTree(tree[index + 1]?.content),
						});
					}

					index++;
					continue loop;
				} else if (operatorsWithItemAfter.includes(item.name)) {
					if (item.name === operators.squareRoot) {
						newTree.push({
							category: categories.operator,
							name: operators.squareRoot,
							radicand: recursiveTree(tree[index + 1]?.content),
						});
					}

					index++;
					continue loop;
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
