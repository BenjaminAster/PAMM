
import { categories, operators, allBracketsSyntaxes, keywords, operatorList } from "../../constants.ts";

export default (mathTree: any[]) => {

	const recursiveRender = (tree: any[], { outerElement = false } = {}) => {

		const fragment = new DocumentFragment();

		for (const [expressionIndex, expression] of tree.entries()) {
			const expressionFragment = new DocumentFragment();

			for (const item of expression) {

				if (item.category === categories.operator) {
					if (item.operator === operators.fraction) {

						const numerator = recursiveRender(item.numerator);
						const denominator = recursiveRender(item.denominator);

						const element = <mfrac></mfrac>;
						element.append(numerator);
						element.append(denominator);
						expressionFragment.append(element);

					} else if (item.operator === operators.power) {

						if (item.base[0]?.[0]?.operator === operators.index) {
							const base = recursiveRender(item.base[0][0].base);
							const index = recursiveRender(item.base[0][0].index);
							const exponent = recursiveRender(item.exponent);

							const element = <msubsup></msubsup>;
							element.append(base);
							element.append(index);
							element.append(exponent);
							expressionFragment.append(element);
						} else {
							const base = recursiveRender(item.base);
							const exponent = recursiveRender(item.exponent);

							const element = <msup></msup>;
							element.append(base);
							element.append(exponent);
							expressionFragment.append(element);
						}

					} else if (item.operator === operators.factorial) {

						const expression = recursiveRender(item.expression);
						const exclamationMark = <mo></mo>;
						exclamationMark.textContent = "!";

						const mathRow = <mrow></mrow>;
						mathRow.append(expression);
						mathRow.append(exclamationMark);
						expressionFragment.append(mathRow);

					} else if (item.operator === operators.index) {

						const base = recursiveRender(item.base);
						const index = recursiveRender(item.index);

						const element = <msub></msub>;
						element.append(base);
						element.append(index);
						expressionFragment.append(element);

					} else if (item.operator === operators.root) {

						const degree = recursiveRender(item.degree);
						const radicand = recursiveRender(item.radicand);

						const element = <mroot></mroot>;
						element.append(radicand);
						element.append(degree);
						expressionFragment.append(element);

					} else if (item.operator === operators.squareRoot) {

						const radicand = recursiveRender(item.radicand);

						const element = <msqrt></msqrt>;
						element.append(radicand);
						expressionFragment.append(element);

					} else if (item.operator === operators.plus) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.plusMinus) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.minus) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.times) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.divide) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.colon) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.invisibleTimes) {

						const element = <mo></mo>;
						element.innerHTML = "&InvisibleTimes;";
						expressionFragment.append(element);

					} else if (item.operator === operators.equals) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.lessThan) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.greaterThan) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.lessThanOrEqual) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.greaterThanOrEqual) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.doubleLeftArrow) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.doubleRightArrow) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.doubleLeftRightArrow) {

						const element = <mo></mo>;
						element.textContent = operatorList.find(({ name }) => name === item.operator).character;
						expressionFragment.append(element);

					} else if (item.operator === operators.sum) {

						const underOverElement = <munderover></munderover>;
						const bottomElement = recursiveRender(item.startExpression);
						const topElement = recursiveRender(item.endExpression);
						const sigmaElement = <mo></mo>;
						sigmaElement.textContent = operatorList.find(({ name }) => name === item.operator).character;

						underOverElement.append(sigmaElement, bottomElement, topElement);

						const container = <mrow></mrow>;
						container.append(underOverElement, recursiveRender(item.expression));
						expressionFragment.append(container);

					} else if (item.operator === operators.integral) {

						const underOverElement = <msubsup></msubsup>;
						const lowerLimitElement = recursiveRender(item.lowerLimit);
						const upperLimitElement = recursiveRender(item.upperLimit);
						const integralElement = <mo></mo>;
						integralElement.textContent = operatorList.find(({ name }) => name === item.operator).character;

						underOverElement.append(integralElement, lowerLimitElement, upperLimitElement);

						const differentialElement = <mrow></mrow>;
						const dElement = <mo></mo>;
						dElement.textContent = "d";
						dElement.setAttribute("rspace", "0");
						differentialElement.append(dElement);
						differentialElement.append(recursiveRender(item.integrationVariable));

						const container = <mrow></mrow>;
						container.append(underOverElement, recursiveRender(item.integrand), differentialElement);
						expressionFragment.append(container);

					}

				} else if (item.category === categories.keyword) {

					if (item.keywordName === keywords.pi) {
						const element = <mi></mi>;
						element.innerHTML = "&pi;";

						expressionFragment.append(element);
					}

				} else if (item.category === categories.variable) {

					const element = <mi></mi>;
					element.textContent = item.variable;

					expressionFragment.append(element);

				} else if (item.category === categories.number) {

					const element = <mn></mn>;
					element.textContent = item.number;

					expressionFragment.append(element);

				} else if (item.category === categories.anyBracket) {

					const openingBracket = <mo></mo>;
					openingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyOpeningBracket && name == item.anyBracketType).syntax;

					const closingBracket = <mo></mo>;
					closingBracket.textContent = allBracketsSyntaxes.find(({ name, type }) => type === categories.anyClosingBracket && name == item.anyBracketType).syntax;

					const container = <mrow></mrow>;
					container.append(openingBracket, recursiveRender(item.content), closingBracket);
					expressionFragment.append(container);

				} else if (item.category === categories.function) {

					const mathRow = <mrow></mrow>;

					const functionNameElement = <mi></mi>;
					functionNameElement.textContent = item.functionName;
					mathRow.append(functionNameElement);

					const openingBracket = <mo></mo>;
					openingBracket.textContent = "(";
					mathRow.append(openingBracket);

					mathRow.append(recursiveRender(item.parameters));

					const closingBracket = <mo></mo>;
					closingBracket.textContent = ")";
					mathRow.append(closingBracket);

					expressionFragment.append(mathRow);

				}
			}

			if (expressionIndex >= 1) {
				const commaElement = <mo></mo>;
				commaElement.textContent = ",";
				fragment.append(commaElement);
			}

			if (expression.length !== 1 && tree.length === 1 && !outerElement) {
				const mathRow = <mrow></mrow>;
				mathRow.append(expressionFragment);
				fragment.append(mathRow);
			} else {
				fragment.append(expressionFragment);
			}
		}

		if (tree.length !== 1 && !outerElement) {
			const mathRow = <mrow></mrow>;
			mathRow.append(fragment);
			return mathRow;
		} else {
			return fragment;
		}
	};

	return recursiveRender(mathTree, { outerElement: true });
};

