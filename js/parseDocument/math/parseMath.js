
import stringToArray from "./stringToArray.js";
import arrayToTree from "./arrayToTree.js";
import generateMathML from "./mathml/renderMathML.js";

export default (/** @type {string} */ mathString) => {
	const array = stringToArray(mathString);
	const tree = arrayToTree(array);
	const mathRow = generateMathML(tree);
	return mathRow;
};

