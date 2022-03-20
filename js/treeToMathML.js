
export default (/** @type {any[]} */ mathTree) => {
	const textNode = document.createTextNode(JSON.stringify(mathTree, null, "\t"));
	const fragment = new DocumentFragment();
	fragment.append(textNode);
	return fragment;
};

