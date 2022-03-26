
import { categories } from "./stringToArray.js";

export default (/** @type {any[]} */ mathArray) => {
	const groupsTree = [{
		type: "base",
		content: [],
	}];

	for (const [index, item] of mathArray.entries()) {
		if (item.category === categories.anyOpeningBracket) {
			groupsTree.push({
				type: item.name,
				content: [],
			});
		} else if (item.category === categories.anyClosingBracket) {
			const lastGroup = groupsTree.at(-1);
			groupsTree.pop();
			if (lastGroup.type === item.name) {
				groupsTree.at(-1).content.push(lastGroup);
			}
		} else {
			groupsTree.at(-1).content.push({
				...item,
				type: "item",
			});
		}
	}

	return groupsTree[0].content;
};
