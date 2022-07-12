
import { createMathElement } from "../../utils.js";
import renderMath from "../math/renderMath.js";

export default (/** @type {any[]} */ documentTree) => {

	const recursiveRender = (/** @type {any[]} */ tree) => {
		const fragment = new DocumentFragment();

		for (const item of tree) {
			switch (item.type) {
				case ("text"): {
					fragment.append(document.createTextNode(item.string));
					break;
				} case ("math"): {
					const mathElement = createMathElement("math");
					if (item.displayBlock) mathElement.setAttribute("display", "block");
					if (item.displayBlock !== item.normalStyle) mathElement.setAttribute("displaystyle", item.normalStyle.toString());
					mathElement.append(renderMath(item.content));
					fragment.append(mathElement);
					break;
				} case ("newLine"): {
					const lineBreakElement = document.createElement("br");
					fragment.append(lineBreakElement);
					break;
				} case ("paragraph"): {
					const paragraphElement = document.createElement("p");
					paragraphElement.append(recursiveRender(item.content))
					fragment.append(paragraphElement);
					break;
				} case ("bold"): {
					const boldElement = document.createElement("strong");
					boldElement.append(recursiveRender(item.content))
					fragment.append(boldElement);
					break;
				} case ("italic"): {
					const boldElement = document.createElement("em");
					boldElement.append(recursiveRender(item.content))
					fragment.append(boldElement);
					break;
				} case ("heading"): {
					const headingElement = document.createElement("h" + Math.min(item.headingLevel, 6));
					headingElement.append(recursiveRender(item.content));
					fragment.append(headingElement);
					break;
				}
			}
		}

		return fragment;
	};

	return recursiveRender(documentTree);
};
