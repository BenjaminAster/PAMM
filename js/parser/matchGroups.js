
import {
	categories,
	allBrackets,
} from "./stringToArray.js";

export default (/** @type {any[]} */ mathArray) => {
	const groupsTree = [{
		type: "base",
		content: [],
	}];

	for (const [index, item] of mathArray.entries()) {
		if (item.category === categories.anyOpeningBracket && item.name === allBrackets.openingGroup) {

		}
	}

	// return groupsTree;
	return mathArray;
};
