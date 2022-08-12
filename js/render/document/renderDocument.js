
import { createMathElement } from "../../app.js";
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
					if (item.displayBlock !== item.displayStyle) mathElement.setAttribute("displaystyle", item.displayStyle.toString());
					mathElement.append(renderMath(item.content));
					fragment.append(mathElement);
					break;
				} case ("newLine"): {
					const lineBreakElement = document.createElement("br");
					fragment.append(lineBreakElement);
					break;
				} case ("paragraph"): {
					const paragraphElement = document.createElement("p");
					if (item.bottomMargin) paragraphElement.classList.add("bottom-margin");
					paragraphElement.append(recursiveRender(item.content))
					fragment.append(paragraphElement);
					break;
				} case ("bold"): {
					const boldElement = document.createElement("strong");
					boldElement.append(recursiveRender(item.content))
					fragment.append(boldElement);
					break;
				} case ("italic"): {
					const italicElement = document.createElement("em");
					italicElement.append(recursiveRender(item.content))
					fragment.append(italicElement);
					break;
				} case ("underline"): {
					const underlineElement = document.createElement("u");
					underlineElement.append(recursiveRender(item.content))
					fragment.append(underlineElement);
					break;
				} case ("code"): {
					const codeElement = document.createElement("code");
					codeElement.append(recursiveRender(item.content))
					fragment.append(codeElement);
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
