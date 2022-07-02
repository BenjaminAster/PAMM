
import { categories, operators, allBracketsSyntaxes, keywordNames } from "../parser/stringToArray.js";

const createMathElement = (/** @type {string} */ name) => document.createElement("m" + name);

export default (/** @type {any[]} */ mathTree) => {

	const recursiveRender = (/** @type {any[]} */ tree) => {
		const elementArray = [];

		for (const item of tree) {

			if (item.category === categories.operator) {
				if (item.name === operators.fraction) {

					const numerator = recursiveRender(item.numerator);
					const denominator = recursiveRender(item.denominator);

					const element = createMathElement("frac");
					element.appendChild(numerator);
					element.appendChild(denominator);
					elementArray.push(element);

				} else if (item.name === operators.power) {

					const base = recursiveRender(item.base);
					const exponent = recursiveRender(item.exponent);

					const element = createMathElement("sup");
					element.appendChild(base);
					element.appendChild(exponent);
					elementArray.push(element);

				} else if (item.name === operators.index) {

					const base = recursiveRender(item.base);
					const index = recursiveRender(item.index);

					const element = createMathElement("sub");
					element.appendChild(base);
					element.appendChild(index);
					elementArray.push(element);

				} else if (item.name === operators.root) {

					const degree = recursiveRender(item.degree);
					const radicand = recursiveRender(item.radicand);

					const element = createMathElement("root");
					element.appendChild(radicand);
					element.appendChild(degree);
					elementArray.push(element);

				} else if (item.name === operators.squareRoot) {

					const radicand = recursiveRender(item.radicand);

					const element = createMathElement("sqrt");
					element.appendChild(radicand);
					elementArray.push(element);

				} else if (item.name === operators.plus) {

					const element = createMathElement("o");
					element.innerHTML = "&plus;";
					elementArray.push(element);

				} else if (item.name === operators.minus) {

					const element = createMathElement("o");
					// element.innerHTML = "&minus;";
					element.innerHTML = "&minus;";
					elementArray.push(element);

				} else if (item.name === operators.times) {

					const element = createMathElement("o");
					element.innerHTML = "&sdot;";
					elementArray.push(element);

				} else if (item.name === operators.divide) {

					const element = createMathElement("o");
					element.innerHTML = "&divide;";
					elementArray.push(element);

				} else if (item.name === operators.invisibleTimes) {

					const element = createMathElement("o");
					element.innerHTML = "&InvisibleTimes;";
					elementArray.push(element);

				} else if (item.name === operators.equals) {

					const element = createMathElement("o");
					element.innerHTML = "=";
					elementArray.push(element);

				}

			} else if (item.category === categories.keyword) {

				if (item.name === keywordNames.pi) {
					const element = createMathElement("i");
					element.innerHTML = "&pi;";

					elementArray.push(element);
				}

			} else if (item.category === categories.variable) {

				const element = createMathElement("i");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.number) {

				const element = createMathElement("n");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.anyBracket) {

				const openingBracket = createMathElement("o");
				openingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyOpeningBracket && name == item.name).syntax;

				const closingBracket = createMathElement("o");
				closingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyClosingBracket && name == item.name).syntax;

				elementArray.push(openingBracket, recursiveRender(item.content), closingBracket);

			}
		}

		const fragment = new DocumentFragment();
		fragment.append(...elementArray);
		const mathRow = createMathElement("row");
		mathRow.appendChild(fragment);
		return mathRow;
	};

	return recursiveRender(mathTree);
};

