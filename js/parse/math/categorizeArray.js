
export const characterCategories = {
	number: "number",
	letters: "letters",
	symbols: "symbols",
	anyOpeningBracket: "anyOpeningBracket", // ( [ {
	anyClosingBracket: "anyClosingBracket", // ) ] }
	whitespace: "whitespace",
};

const regularExpressions = {
	number: /^[\d\.]$/u,
	letter: /^[\p{Letter}]$/u,
	anyOpeningBracket: /^[([{]$/u,
	anyClosingBracket: /^[)\]}]$/u,
	whitespace: /^[\s]$/u,
};

export const categories = {
	number: "number",
	variable: "variable",
	keyword: "keyword",
	operator: "operator",
	anyOpeningBracket: "anyOpeningBracket",
	anyClosingBracket: "anyClosingBracket",
	anyBracket: "anyBracket",
	whitespace: "whitespace",
};

export const operators = {
	plus: "plus",
	minus: "minus",
	times: "times",
	fraction: "fraction",
	divide: "divide",
	power: "power",
	root: "root",
	squareRoot: "squareRoot",
	invisibleTimes: "invisibleTimes",
	index: "index",
	equals: "equals",
	lessThan: "lessThan",
	lessThanOrEqual: "lessThanOrEqual",
	greaterThan: "greaterThan",
	greaterThanOrEqual: "greaterThanOrEqual",
	doubleLeftArrow: "doubleLeftArrow",
	doubleRightArrow: "doubleRightArrow",
	doubleLeftRightArrow: "doubleLeftRightArrow",
	square: "square",
	factorial: "factorial",
	plusMinus: "plusMinus",
};

export const operatorSyntaxes = [
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
		syntax: "^",
		name: operators.power,
	},
	{
		syntax: "^^",
		name: operators.square,
	},
	{
		syntax: "#",
		name: operators.root,
	},
	{
		syntax: "_",
		name: operators.index,
	},
	{
		syntax: "=",
		name: operators.equals,
	},
	{
		syntax: "!",
		name: operators.factorial,
	},
	{
		syntax: "<",
		name: operators.lessThan,
	},
	{
		syntax: ">",
		name: operators.greaterThan,
	},
	{
		syntax: "<=",
		name: operators.lessThanOrEqual,
	},
	{
		syntax: ">=",
		name: operators.greaterThanOrEqual,
	},
	{
		syntax: "<==",
		name: operators.doubleLeftArrow,
	},
	{
		syntax: "==>",
		name: operators.doubleRightArrow,
	},
	{
		syntax: "<==>",
		name: operators.doubleLeftRightArrow,
	},
	{
		syntax: "+-",
		name: operators.plusMinus,
	},
];

export const allBrackets = {
	parenthesis: "parenthesis",
	bracket: "bracket",
	brace: "brace",
	group: "group",
};

export const allBracketsSyntaxes = [
	{
		syntax: "(",
		type: categories.anyOpeningBracket,
		name: allBrackets.parenthesis,
	},
	{
		syntax: ")",
		type: categories.anyClosingBracket,
		name: allBrackets.parenthesis,
	},
	{
		syntax: "[",
		type: categories.anyOpeningBracket,
		name: allBrackets.bracket,
	},
	{
		syntax: "]",
		type: categories.anyClosingBracket,
		name: allBrackets.bracket,
	},
	{
		syntax: "{",
		type: categories.anyOpeningBracket,
		name: allBrackets.brace,
	},
	{
		syntax: "}",
		type: categories.anyClosingBracket,
		name: allBrackets.brace,
	},
];

export const keywordNames = {
	sine: "sine",
	cosine: "cosine",
	pi: "pi",
};

export const keywords = [
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

const categorizeSymbols = (/** @type {string} */ symbolString) => {
	const array = [];
	let currentString = "";
	symbolString += " ";

	for (const character of symbolString) {
		let operator = operatorSyntaxes.find(({ syntax }) => syntax.startsWith(currentString + character));
		if (operator) {

		} else {
			if (operator = operatorSyntaxes.find(({ syntax }) => syntax === currentString)) {
				array.push({
					operator: operator.name,
				});
				currentString = "";
			}
		}

		currentString += character
	}

	return array;
}

export default (/** @type {string} */ mathString) => {
	mathString = ` ${mathString.trim()} `;
	const /** @type {any[]} */ array = [];
	let currentString = "";
	let /** @type {keyof characterCategories} */ previousCharacterCategory;

	for (const character of mathString) {
		let characterCategory = /** @type {keyof characterCategories} */ ((() => {
			if (character.match(regularExpressions.number)) return characterCategories.number;
			if (character.match(regularExpressions.letter)) return characterCategories.letters;
			if (character.match(regularExpressions.anyOpeningBracket)) return characterCategories.anyOpeningBracket;
			if (character.match(regularExpressions.anyClosingBracket)) return characterCategories.anyClosingBracket;
			if (character.match(regularExpressions.whitespace)) return characterCategories.whitespace;
			return characterCategories.symbols;
		})());

		if (characterCategory !== previousCharacterCategory && previousCharacterCategory) {
			if ([characterCategories.anyOpeningBracket, characterCategories.anyClosingBracket].includes(previousCharacterCategory)) {
				array.push(...[...currentString].map((anyBracket) => ({
					characterCategory: previousCharacterCategory,
					string: anyBracket,
				})));
			} else if (previousCharacterCategory === characterCategories.symbols) {
				array.push(...categorizeSymbols(currentString).map(({ operator }) => ({
					// category: categories.operator,
					// name: operator,
					// groupsNotMatched: true,
					characterCategory: previousCharacterCategory,
					// name: operator,
					// groupsNotMatched: true,
					string: currentString,
					operator,
				})));
			} else {
				array.push({
					characterCategory: previousCharacterCategory,
					string: currentString,
				});
			}
			currentString = "";
		}

		currentString += character;

		previousCharacterCategory = characterCategory;
	}

	array.push({
		characterCategory: characterCategories.whitespace,
	});

	return array;
};
