
import stringToArray from "./stringToArray.js";
import arrayToTree from "./arrayToTree.js";
import treeToMathML from "./treeToMathML.js";


export default (/** @type {string} */ mathString) => {
	const array = stringToArray(mathString);
	const tree = arrayToTree(array);
	const mathML = treeToMathML(tree);
	return mathML;
};

