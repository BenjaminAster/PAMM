
import matchGroups from "./matchGroups.js";

export default (/** @type {any[]} */ mathArray) => {
	const groupsTree = matchGroups(mathArray);

	return groupsTree;
};
