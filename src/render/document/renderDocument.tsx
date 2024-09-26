
import renderMath from "../math/renderMath.tsx";

export default (documentTree: any[]) => {

	const recursiveRender = (tree: any[]) => {
		const fragment = new DocumentFragment();

		for (const item of tree) {
			switch (item.type) {
				case ("text"): {
					fragment.append(new Text(item.string));
					break;
				} case ("math"): {
					const mathElement = <math></math>;
					if (item.displayBlock) mathElement.setAttribute("display", "block");
					if (item.displayBlock !== item.displayStyle) mathElement.setAttribute("displaystyle", item.displayStyle);
					mathElement.append(renderMath(item.content));
					fragment.append(mathElement);
					break;
				} case ("newLine"): {
					const lineBreakElement = <br></br>;
					fragment.append(lineBreakElement);
					break;
				} case ("paragraph"): {
					const paragraphElement = <p></p>;
					if (item.bottomMargin) paragraphElement.classList.add("bottom-margin");
					paragraphElement.append(recursiveRender(item.content))
					fragment.append(paragraphElement);
					break;
				} case ("bold"): {
					const boldElement = <strong></strong>;
					boldElement.append(recursiveRender(item.content))
					fragment.append(boldElement);
					break;
				} case ("italic"): {
					const italicElement = <em></em>;
					italicElement.append(recursiveRender(item.content))
					fragment.append(italicElement);
					break;
				} case ("underline"): {
					const underlineElement = <u></u>;
					underlineElement.append(recursiveRender(item.content))
					fragment.append(underlineElement);
					break;
				} case ("code"): {
					const codeElement = <code></code>;
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
