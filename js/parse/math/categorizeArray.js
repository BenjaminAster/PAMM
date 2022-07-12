
export const characterCategories =  {
	number: "number",
	letters: "letters",
	symbols: "symbols",
	anyOpeningBracket: "anyOpeningBracket", // ( [ {
	anyClosingBracket: "anyClosingBracket", // ) ] }
	whitespace: "whitespace",
};

const regularExpressions = {
	number: /^[\d\.]$/,
	letter: /^[\p{L}]$/u,
	symbol: /^[+-/*#=_]$/,
	anyOpeningBracket: /^[([{]$/,
	anyClosingBracket: /^[)\]}]$/,
	whitespace: /^[\s]$/,
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
		syntax: "**",
		name: operators.power,
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

export default (/** @type {string} */ mathString) => {
	mathString = ` ${mathString.trim()} `;
	const /** @type {any[]} */ array = [];
	let currentString = "";
	let /** @type {string} */ previousCharacterCategory;

	for (const character of mathString) {
		const characterCategory = (() => {
			if (character.match(regularExpressions.number)) return characterCategories.number;
			if (character.match(regularExpressions.letter)) return characterCategories.letters;
			if (character.match(regularExpressions.symbol)) return characterCategories.symbols;
			if (character.match(regularExpressions.anyOpeningBracket)) return characterCategories.anyOpeningBracket;
			if (character.match(regularExpressions.anyClosingBracket)) return characterCategories.anyClosingBracket;
			if (character.match(regularExpressions.whitespace)) return characterCategories.whitespace;
		})();

		if (characterCategory !== previousCharacterCategory && currentString) {
			array.push({
				characterCategory: previousCharacterCategory,
				string: currentString,
			});
			currentString = "";
		} else if ([characterCategories.anyOpeningBracket, characterCategories.anyClosingBracket].includes(characterCategory)) {
			array.push({
				characterCategory: characterCategory,
				string: character,
			});
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
