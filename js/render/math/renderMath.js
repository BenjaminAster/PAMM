
import { categories, operators, allBracketsSyntaxes, keywordNames } from "../../parse/math/categorizeArray.js";
import { createMathElement } from "../../utils.js";

export default (/** @type {any[]} */ mathTree) => {

	const recursiveRender = (/** @type {any[]} */ tree) => {
		const elementArray = [];

		for (const item of tree) {

			if (item.category === categories.operator) {
				if (item.name === operators.fraction) {

					const numerator = recursiveRender(item.numerator);
					const denominator = recursiveRender(item.denominator);

					const element = createMathElement("mfrac");
					element.appendChild(numerator);
					element.appendChild(denominator);
					elementArray.push(element);

				} else if (item.name === operators.power) {

					const base = recursiveRender(item.base);
					const exponent = recursiveRender(item.exponent);

					const element = createMathElement("msup");
					element.appendChild(base);
					element.appendChild(exponent);
					elementArray.push(element);

				} else if (item.name === operators.square) {

					const base = recursiveRender(item.base);
					const exponent = Object.assign(createMathElement("mn"), {
						textContent: "2",
					});

					const element = createMathElement("msup");
					element.appendChild(base);
					element.appendChild(exponent);
					elementArray.push(element);

				} else if (item.name === operators.factorial) {

					const expression = recursiveRender(item.expression);
					const exclamationMark = Object.assign(createMathElement("mo"), {
						textContent: "!",
					});

					elementArray.push(expression);
					elementArray.push(exclamationMark);

				} else if (item.name === operators.index) {

					const base = recursiveRender(item.base);
					const index = recursiveRender(item.index);

					const element = createMathElement("msub");
					element.appendChild(base);
					element.appendChild(index);
					elementArray.push(element);

				} else if (item.name === operators.root) {

					const degree = recursiveRender(item.degree);
					const radicand = recursiveRender(item.radicand);

					const element = createMathElement("mroot");
					element.appendChild(radicand);
					element.appendChild(degree);
					elementArray.push(element);

				} else if (item.name === operators.squareRoot) {

					const radicand = recursiveRender(item.radicand);

					const element = createMathElement("msqrt");
					element.appendChild(radicand);
					elementArray.push(element);

				} else if (item.name === operators.plus) {

					const element = createMathElement("mo");
					element.innerHTML = "&plus;";
					elementArray.push(element);

				} else if (item.name === operators.plusMinus) {

					const element = createMathElement("mo");
					element.innerHTML = "&PlusMinus;";
					elementArray.push(element);

				} else if (item.name === operators.minus) {

					const element = createMathElement("mo");
					element.innerHTML = "&minus;";
					elementArray.push(element);

				} else if (item.name === operators.times) {

					const element = createMathElement("mo");
					element.innerHTML = "&sdot;";
					elementArray.push(element);

				} else if (item.name === operators.divide) {

					const element = createMathElement("mo");
					element.innerHTML = "&divide;";
					elementArray.push(element);

				} else if (item.name === operators.invisibleTimes) {

					const element = createMathElement("mo");
					element.innerHTML = "&InvisibleTimes;";
					elementArray.push(element);

				} else if (item.name === operators.equals) {

					const element = createMathElement("mo");
					element.innerHTML = "=";
					elementArray.push(element);

				} else if (item.name === operators.lessThan) {

					const element = createMathElement("mo");
					element.innerHTML = "<";
					elementArray.push(element);

				} else if (item.name === operators.greaterThan) {

					const element = createMathElement("mo");
					element.innerHTML = ">";
					elementArray.push(element);

				} else if (item.name === operators.lessThanOrEqual) {

					const element = createMathElement("mo");
					element.innerHTML = "&le;";
					elementArray.push(element);

				} else if (item.name === operators.greaterThanOrEqual) {

					const element = createMathElement("mo");
					element.innerHTML = "&ge;";
					elementArray.push(element);

				} else if (item.name === operators.doubleLeftArrow) {

					const element = createMathElement("mo");
					element.innerHTML = "&DoubleLongLeftArrow;";
					elementArray.push(element);

				} else if (item.name === operators.doubleRightArrow) {

					const element = createMathElement("mo");
					element.innerHTML = "&DoubleLongRightArrow;";
					elementArray.push(element);

				} else if (item.name === operators.doubleLeftRightArrow) {

					const element = createMathElement("mo");
					element.innerHTML = "&DoubleLongLeftRightArrow;";
					elementArray.push(element);

				}

			} else if (item.category === categories.keyword) {

				if (item.name === keywordNames.pi) {
					const element = createMathElement("mi");
					element.innerHTML = "&pi;";

					elementArray.push(element);
				}

			} else if (item.category === categories.variable) {

				const element = createMathElement("mi");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.number) {

				const element = createMathElement("mn");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.anyBracket) {

				const openingBracket = createMathElement("mo");
				openingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyOpeningBracket && name == item.name).syntax;

				const closingBracket = createMathElement("mo");
				closingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyClosingBracket && name == item.name).syntax;

				elementArray.push(openingBracket, recursiveRender(item.content), closingBracket);

			}
		}

		const fragment = new DocumentFragment();
		fragment.append(...elementArray);
		const mathRow = createMathElement("mrow");
		mathRow.appendChild(fragment);
		return mathRow;
	};

	return recursiveRender(mathTree);
};

