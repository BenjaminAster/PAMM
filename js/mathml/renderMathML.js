
import { categories, operators, allBracketsSyntaxes, keywordNames } from "../parser/stringToArray.js";

export default (/** @type {any[]} */ mathTree) => {

	const recursiveRender = (/** @type {any[]} */ tree) => {
		const elementArray = [];

		for (const item of tree) {

			if (item.category === categories.operator) {
				if (item.name === operators.fraction) {

					const numerator = recursiveRender(item.numerator);
					const denominator = recursiveRender(item.denominator);

					const element = document.createElement("mfrac");
					element.appendChild(numerator);
					element.appendChild(denominator);
					elementArray.push(element);

				} else if (item.name === operators.power) {

					const base = recursiveRender(item.base);
					const exponent = recursiveRender(item.exponent);

					const element = document.createElement("msup");
					element.appendChild(base);
					element.appendChild(exponent);
					elementArray.push(element);

				} else if (item.name === operators.index) {

					const base = recursiveRender(item.base);
					const index = recursiveRender(item.index);

					const element = document.createElement("msub");
					element.appendChild(base);
					element.appendChild(index);
					elementArray.push(element);

				} else if (item.name === operators.root) {

					const degree = recursiveRender(item.degree);
					const radicand = recursiveRender(item.radicand);

					const element = document.createElement("mroot");
					element.appendChild(radicand);
					element.appendChild(degree);
					elementArray.push(element);

				} else if (item.name === operators.squareRoot) {

					const radicand = recursiveRender(item.radicand);

					const element = document.createElement("msqrt");
					element.appendChild(radicand);
					elementArray.push(element);

				} else if (item.name === operators.plus) {

					const element = document.createElement("mo");
					element.innerHTML = "&plus;";
					elementArray.push(element);

				} else if (item.name === operators.minus) {

					const element = document.createElement("mo");
					element.innerHTML = "&minus;";
					elementArray.push(element);

				} else if (item.name === operators.times) {

					const element = document.createElement("mo");
					element.innerHTML = "&sdot;";
					elementArray.push(element);

				} else if (item.name === operators.divide) {

					const element = document.createElement("mo");
					element.innerHTML = "&divide;";
					elementArray.push(element);

				} else if (item.name === operators.invisibleTimes) {

					const element = document.createElement("mo");
					element.innerHTML = "&InvisibleTimes;";
					elementArray.push(element);

				} else if (item.name === operators.equals) {

					const element = document.createElement("mo");
					element.innerHTML = "=";
					elementArray.push(element);

				}

			} else if (item.category === categories.keyword) {

				if (item.name === keywordNames.pi) {
					const element = document.createElement("mi");
					element.innerHTML = "&pi;";

					elementArray.push(element);
				}

			} else if (item.category === categories.variable) {

				const element = document.createElement("mi");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.number) {

				const element = document.createElement("mn");
				element.textContent = item.string;

				elementArray.push(element);

			} else if (item.category === categories.anyBracket) {

				const openingBracket = document.createElement("mo");
				openingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyOpeningBracket && name == item.name).syntax;

				const closingBracket = document.createElement("mo");
				closingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyClosingBracket && name == item.name).syntax;

				elementArray.push(openingBracket, recursiveRender(item.content), closingBracket);

			}
		}

		const fragment = new DocumentFragment();
		fragment.append(...elementArray);
		const mathRow = document.createElement("mrow");
		mathRow.appendChild(fragment);
		return mathRow;
	};

	return recursiveRender(mathTree);
};

