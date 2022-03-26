
import stringToArray from "./stringToArray.js";
import arrayToTree from "./arrayToTree.js";

export default (/** @type {string} */ mathString) => {
	const array = stringToArray(mathString);
	const tree = arrayToTree(array);
	return tree;
};

