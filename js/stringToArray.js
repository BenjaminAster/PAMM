

import categorizeArray, { characterCategories } from "./categorizeArray.js";

const categories = new class {
	number = "number";
	variable = "variable";
	keyword = "keyword";
	operator = "operator";
	anyOpeningBracket = "anyOpeningBracket";
	anyClosingBracket = "anyClosingBracket";
	whitespace = "whitespace";
};

const operators = new class {
	plus = "plus";
	minus = "minus";
	times = "times";
	fraction = "fraction";
	divide = "divide";
	power = "power";
	root = "root";
	squareRoot = "squareRoot";
	invisibleTimes = "invisibleTimes";
};

const operatorSyntaxes = [
	{
		syntax: "+",
		name: operators.plus,
	},
	{
		syntax: "-",
		name: operators.minus,
	},
	{
		syntax: "*",
		name: operators.times,
	},
	{
		syntax: "/",
		name: operators.fraction,
	},
	{
		syntax: "//",
		name: operators.divide,
	},
	{
		syntax: "**",
		name: operators.power,
	},
	{
		syntax: "#",
		name: operators.root,
	},
];

const allBrackets = new class {
	openingParenthesis = "openingParenthesis";
	closingParenthesis = "closingParenthesis";
	openingBracket = "openingBracket";
	closingBracket = "closingBracket";
	openingBrace = "openingBrace";
	closingBrace = "closingBrace";
	openingGroup = "openingGroup";
	closingGroup = "closingGroup";
};

const allBracketsSyntaxes = [
	{
		syntax: "(",
		name: allBrackets.openingParenthesis,
	},
	{
		syntax: ")",
		name: allBrackets.closingParenthesis,
	},
	{
		syntax: "[",
		name: allBrackets.openingBracket,
	},
	{
		syntax: "]",
		name: allBrackets.closingBracket,
	},
	{
		syntax: "{",
		name: allBrackets.openingBrace,
	},
	{
		syntax: "}",
		name: allBrackets.closingBrace,
	},
];

const keywordNames = new class {
	sine = "sine";
	cosine = "cosine";
	pi = "pi";
};

const keywords = [
	{
		keyword: "sin",
		name: keywordNames.sine,
	},
	{
		keyword: "cos",
		name: keywordNames.cosine,
	},
	{
		keyword: "pi",
		name: keywordNames.pi,
	},
];

export default (/** @type {string} */ mathString) => {
	const categorizedArray = categorizeArray(mathString);

	const /** @type {any[]} */ mathArray = [];
	let /** @type {number[]} */ groupParenthesesDepths = [];

	for (const [index, { characterCategory, string }] of categorizedArray.entries()) {
		if (characterCategory === characterCategories.number) {

			mathArray.push({
				category: characterCategories.number,
				string,
			});
		}
		else if (characterCategory === characterCategories.identifier) {

			if (categorizedArray[index - 1]?.characterCategory === characterCategories.number) {
				mathArray.push({
					category: characterCategories.operator,
					name: operators.invisibleTimes,
				});
			}

			const keyword = keywords.find(({ keyword }) => string === keyword)?.name;

			if (keyword) {
				mathArray.push({
					category: categories.keyword,
					name: keyword,
				});
			}
			else {

				for (const [characterIndex, character] of string.split("").entries()) {

					if (characterIndex > 0) {
						mathArray.push({
							category: categories.operator,
							name: operators.invisibleTimes,
						});
					}

					mathArray.push({
						category: categories.variable,
						string: character,
					});
				}
			}
		}
		else if (characterCategory === characterCategories.operator) {

			const operator = operatorSyntaxes.find(({ syntax }) => string === syntax).name;

			if (![operators.power, operators.root].includes(operator)) {
				while (groupParenthesesDepths.at(-1) <= 0) {
					groupParenthesesDepths.pop();
					mathArray.push({
						category: categories.anyClosingBracket,
						name: allBrackets.closingGroup,
					});
				}
			}

			if (operator === operators.root) {
				if ([characterCategories.anyOpeningBracket, characterCategories.operator, characterCategories.whitespace].includes(categorizedArray[index - 1]?.characterCategory)) {
					mathArray.push({
						category: categories.operator,
						name: operators.squareRoot,
					});
				} else {
					let rootParenthesisDepth = 0;
					let i = index;

					do {
						i--;

						if (categorizedArray[i].characterCategory === characterCategories.anyClosingBracket) {
							rootParenthesisDepth++;
						} else if (categorizedArray[i].characterCategory === characterCategories.anyOpeningBracket) {
							rootParenthesisDepth--;
						}
					} while (
						i >= 0
						&&
						(
							rootParenthesisDepth > 0
							||
							[characterCategories.anyClosingBracket, characterCategories.number, characterCategories.identifier].includes(categorizedArray[i].characterCategory)
						)
					);

					mathArray.splice(i, 0, {
						category: characterCategories.anyOpeningBracket,
						name: allBrackets.openingGroup,
					});

					mathArray.push({
						category: categories.anyClosingBracket,
						name: allBrackets.closingGroup,
					});

					mathArray.push({
						category: categories.operator,
						name: operators.root,
					});
				}

				mathArray.push({
					category: categories.anyOpeningBracket,
					name: allBrackets.openingGroup,
				});
				groupParenthesesDepths.push(0);

			} else {
				mathArray.push({
					category: categories.operator,
					name: operator,
				});
			}

			if (operator === operators.power) {
				mathArray.push({
					category: categories.anyOpeningBracket,
					name: allBrackets.openingGroup,
				});
				groupParenthesesDepths.push(0);
			}
		}
		else if (characterCategory === characterCategories.anyOpeningBracket) {

			const bracket = allBracketsSyntaxes.find(({ syntax }) => string === syntax).name;

			if ([characterCategories.number, characterCategories.identifier].includes(categorizedArray[index - 1]?.characterCategory)) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}

			while (groupParenthesesDepths.at(-1) <= 0) {
				groupParenthesesDepths.pop();
				mathArray.push({
					category: categories.anyClosingBracket,
					name: allBrackets.closingGroup,
				});
			}

			if (groupParenthesesDepths.length > 0) {
				if (bracket === allBrackets.openingParenthesis) {
					groupParenthesesDepths[groupParenthesesDepths.length - 1]++;
				} else if (bracket === allBrackets.closingParenthesis) {
					groupParenthesesDepths[groupParenthesesDepths.length - 1]--;
				}
			}

			mathArray.push({
				category: categories.anyOpeningBracket,
				name: bracket,
			});
		}
		else if (characterCategory === characterCategories.anyClosingBracket) {

			const bracket = allBracketsSyntaxes.find(({ syntax }) => string === syntax).name;

			mathArray.push({
				category: categories.anyClosingBracket,
				name: bracket,
			});
		}
		else if (characterCategory === characterCategories.whitespace) {

			while (groupParenthesesDepths.at(-1) <= 0) {
				groupParenthesesDepths.pop();
				mathArray.push({
					category: categories.anyClosingBracket,
					name: allBrackets.closingGroup,
				});
			}

			if (
				[categorizedArray[index - 1], categorizedArray[index + 1]].every(({ characterCategory, string } = {}, i) => (
					[characterCategories.number, characterCategories.identifier].includes(characterCategory)
					||
					string === [")", "("][i]
				))
			) {
				mathArray.push({
					category: categories.operator,
					name: operators.invisibleTimes,
				});
			}
		}
	}

	return mathArray;
};
