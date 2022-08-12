
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
	function: "function",
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
	comma: "comma",
	semicolon: "semicolon",
	sum: "sum",
};

export const operatorList = [
	{
		syntax: "+",
		name: operators.plus,
		character: "+",
	},
	{
		syntax: "-",
		name: operators.minus,
		character: "−",
	},
	{
		syntax: "*",
		name: operators.times,
		character: "⋅",
	},
	{
		syntax: "/",
		name: operators.fraction,
	},
	{
		syntax: "//",
		name: operators.divide,
		character: "÷",
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
		name: operators.squareRoot,
	},
	{
		syntax: "_",
		name: operators.index,
	},
	{
		syntax: "=",
		name: operators.equals,
		character: "=",
	},
	{
		syntax: "!",
		name: operators.factorial,
		character: "",
	},
	{
		syntax: "<",
		name: operators.lessThan,
		character: "<",
	},
	{
		syntax: ">",
		name: operators.greaterThan,
		character: ">",
	},
	{
		syntax: "<=",
		name: operators.lessThanOrEqual,
		character: "≤",
	},
	{
		syntax: ">=",
		name: operators.greaterThanOrEqual,
		character: "≥",
	},
	{
		syntax: "<==",
		name: operators.doubleLeftArrow,
		character: "⟸",
	},
	{
		syntax: "==>",
		name: operators.doubleRightArrow,
		character: "⟹",
	},
	{
		syntax: "<==>",
		name: operators.doubleLeftRightArrow,
		character: "⟺",
	},
	{
		syntax: "+-",
		name: operators.plusMinus,
		character: "±",
	},
	{
		syntax: ",",
		name: operators.comma,
		character: ",",
	},
	{
		syntax: ";",
		name: operators.semicolon,
		character: ";",
	},
	{
		name: operators.sum,
		character: "∑",
	},
	{
		name: operators.integral,
		character: "∫",
	},
];

const infixOperators = [
	operators.times,
	operators.invisibleTimes,
	operators.equals,
	operators.lessThan,
	operators.lessThanOrEqual,
	operators.greaterThan,
	operators.greaterThanOrEqual,
	operators.doubleLeftArrow,
	operators.doubleRightArrow,
	operators.doubleLeftRightArrow,
];

const infixOrPrefixOperators = [
	operators.plus,
	operators.minus,
	operators.plusMinus,
];

const postfixOperators = [
	operators.factorial,
	operators.square,
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

const specialCharacters = {
	infinity: "infinity",

	Alpha: "Alpha",
	Beta: "Beta",
	Gamma: "Gamma",
	Delta: "Delta",
	Epsilon: "Epsilon",
	Zeta: "Zeta",
	Eta: "Eta",
	Theta: "Theta",
	Iota: "Iota",
	Kappa: "Kappa",
	Lambda: "Lambda",
	Mu: "Mu",
	Nu: "Nu",
	Xi: "Xi",
	Omicron: "Omicron",
	Pi: "Pi",
	Rho: "Rho",
	Sigma: "Sigma",
	Tau: "Tau",
	Upsilon: "Upsilon",
	Phi: "Phi",
	Chi: "Chi",
	Psi: "Psi",
	Omega: "Omega",

	alpha: "alpha",
	beta: "beta",
	gamma: "gamma",
	delta: "delta",
	epsilon: "epsilon",
	zeta: "zeta",
	eta: "eta",
	theta: "theta",
	iota: "iota",
	kappa: "kappa",
	lambda: "lambda",
	mu: "mu",
	nu: "nu",
	xi: "xi",
	omicron: "omicron",
	pi: "pi",
	rho: "rho",
	sigma: "sigma",
	finalsigma: "finalsigma",
	tau: "tau",
	upsilon: "upsilon",
	phi: "phi",
	chi: "chi",
	psi: "psi",
	omega: "omega",
};

export const keywords = {
	sum: "sum",
	integral: "integral",
	sine: "sine",
	choose: "choose",
	...specialCharacters,
};

export const keywordTypes = {
	function: "function",
	normal: "normal",
	specialCharacter: "specialCharacter",
};

const specialCharacterList = [
	{ keyword: "inf", name: keywords.infinity, character: "∞" },

	{ keyword: "Alpha", name: keywords.Alpha, character: "Α" },
	{ keyword: "Beta", name: keywords.Beta, character: "Β" },
	{ keyword: "Gamma", name: keywords.Gamma, character: "Γ" },
	{ keyword: "Delta", name: keywords.Delta, character: "Δ" },
	{ keyword: "Epsilon", name: keywords.Epsilon, character: "Ε" },
	{ keyword: "Zeta", name: keywords.Zeta, character: "Ζ" },
	{ keyword: "Eta", name: keywords.Eta, character: "Η" },
	{ keyword: "Theta", name: keywords.Theta, character: "Θ" },
	{ keyword: "Iota", name: keywords.Iota, character: "Ι" },
	{ keyword: "Kappa", name: keywords.Kappa, character: "Κ" },
	{ keyword: "Lambda", name: keywords.Lambda, character: "Λ" },
	{ keyword: "Mu", name: keywords.Mu, character: "Μ" },
	{ keyword: "Nu", name: keywords.Nu, character: "Ν" },
	{ keyword: "Xi", name: keywords.Xi, character: "Ξ" },
	{ keyword: "Omicron", name: keywords.Omicron, character: "Ο" },
	{ keyword: "Pi", name: keywords.Pi, character: "Π" },
	{ keyword: "Rho", name: keywords.Rho, character: "Ρ" },
	{ keyword: "Sigma", name: keywords.Sigma, character: "Σ" },
	{ keyword: "Tau", name: keywords.Tau, character: "Τ" },
	{ keyword: "Upsilon", name: keywords.Upsilon, character: "Υ" },
	{ keyword: "Phi", name: keywords.Phi, character: "Φ" },
	{ keyword: "Chi", name: keywords.Chi, character: "Χ" },
	{ keyword: "Psi", name: keywords.Psi, character: "Ψ" },
	{ keyword: "Omega", name: keywords.Omega, character: "Ω" },

	{ keyword: "alpha", name: keywords.alpha, character: "α" },
	{ keyword: "beta", name: keywords.beta, character: "β" },
	{ keyword: "gamma", name: keywords.gamma, character: "γ" },
	{ keyword: "delta", name: keywords.delta, character: "δ" },
	{ keyword: "epsilon", name: keywords.epsilon, character: "ε" },
	{ keyword: "zeta", name: keywords.zeta, character: "ζ" },
	{ keyword: "eta", name: keywords.eta, character: "η" },
	{ keyword: "theta", name: keywords.theta, character: "θ" },
	{ keyword: "iota", name: keywords.iota, character: "ι" },
	{ keyword: "kappa", name: keywords.kappa, character: "κ" },
	{ keyword: "lambda", name: keywords.lambda, character: "λ" },
	{ keyword: "mu", name: keywords.mu, character: "μ" },
	{ keyword: "nu", name: keywords.nu, character: "ν" },
	{ keyword: "xi", name: keywords.xi, character: "ξ" },
	{ keyword: "omicron", name: keywords.omicron, character: "ο" },
	{ keyword: "pi", name: keywords.pi, character: "π" },
	{ keyword: "rho", name: keywords.rho, character: "ρ" },
	{ keyword: "sigma", name: keywords.sigma, character: "σ" },
	{ keyword: "finsigma", name: keywords.finalsigma, character: "ς" },
	{ keyword: "tau", name: keywords.tau, character: "τ" },
	{ keyword: "upsilon", name: keywords.upsilon, character: "υ" },
	{ keyword: "phi", name: keywords.phi, character: "φ" },
	{ keyword: "chi", name: keywords.chi, character: "χ" },
	{ keyword: "psi", name: keywords.psi, character: "ψ" },
	{ keyword: "omega", name: keywords.omega, character: "ω" },
];

export const keywordList = [
	{
		keyword: "sum",
		name: keywords.sum,
		type: keywordTypes.function,
	},
	{
		keyword: "int",
		name: keywords.integral,
		type: keywordTypes.function,
	},
	{
		keyword: "sin",
		name: keywords.sine,
		type: keywordTypes.function,
	},
	{
		keyword: "choose",
		name: keywords.choose,
		type: keywordTypes.normal,
	},
	...specialCharacterList.map((specialCharacter) => ({ ...specialCharacter, type: keywordTypes.specialCharacter })),
];

const categorizeSymbols = (/** @type {string} */ symbolString) => {
	const array = [];
	let currentString = "";
	symbolString += " ";

	for (const character of symbolString) {
		let operator = operatorList.find(({ syntax }) => syntax?.startsWith(currentString + character));
		if (operator) {

		} else {
			if (operator = operatorList.find(({ syntax }) => syntax === currentString)) {
				array.push({ operator: operator.name });
				currentString = "";
			}
		}

		currentString += character
	}

	return array;
}

export default (/** @type {string} */ mathString) => {
	mathString += " ";
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
			if (previousCharacterCategory === characterCategories.anyOpeningBracket) {
				array.push(...[...currentString].map((string) => ({
					category: categories.anyOpeningBracket,
					anyBracketType: allBracketsSyntaxes.find(({ syntax }) => string === syntax).name,
				})));
			} else if (previousCharacterCategory === characterCategories.anyClosingBracket) {
				array.push(...[...currentString].map((string) => ({
					category: categories.anyClosingBracket,
					anyBracketType: allBracketsSyntaxes.find(({ syntax }) => string === syntax).name,
				})));

				if (character === "(" && array.at(-1).anyBracketType === allBrackets.parenthesis) {
					array.push({
						category: categories.operator,
						operator: operators.invisibleTimes,
					});
				}
			} else if (previousCharacterCategory === characterCategories.symbols) {
				const operatorsArray = categorizeSymbols(currentString);
				if (operatorsArray[0].operator === operators.squareRoot && ![categories.whitespace, categories.anyOpeningBracket].includes(array.at(-1)?.category)) {
					operatorsArray[0].operator = operators.root;
				}

				const whitespaceBefore = array.at(-1)?.category === categories.whitespace;
				const whitespaceAfter = characterCategory === characterCategories.whitespace;

				if (whitespaceBefore && !whitespaceAfter) {
					if (infixOperators.includes(operatorsArray[0].operator)) {
						array.push({
							category: categories.operator,
							groupsNotMatched: true,
							operator: operatorsArray.shift().operator,
						});
						array.push({
							category: categories.whitespace,
						});
					}
				}

				for (const operatorItem of operatorsArray) {
					array.push({
						operator: operatorItem.operator,
						category: categories.operator,
						groupsNotMatched: true,
					});
				}

				if (!whitespaceBefore && whitespaceAfter) {
					if ([...infixOperators, ...infixOrPrefixOperators].includes(operatorsArray.at(-1).operator)) {
						array.splice(-1, 0, {
							category: categories.whitespace,
						});
					}
				} else if (!whitespaceAfter) {
					if (
						postfixOperators.includes(operatorsArray.at(-1)?.operator)
						&&
						(characterCategory === characterCategories.number || character === "(")
					) {
						array.push({
							category: categories.operator,
							operator: operators.invisibleTimes,
						});
					}
				}

			} else if (previousCharacterCategory === characterCategories.whitespace) {
				if (
					character === "("
					&&
					(
						[categories.number, categories.variable].includes(array.at(-1)?.category)
						||
						(array.at(-1)?.category === categories.anyBracket && array.at(-1).anyBracketType === allBrackets.parenthesis)
					)
				) {
					array.push({
						category: categories.whitespace,
					});
					array.push({
						category: categories.operator,
						operator: operators.invisibleTimes,
					});
				}

				array.push({
					category: categories.whitespace,
				});
			} else if (previousCharacterCategory === characterCategories.number) {
				array.push({
					category: categories.number,
					number: currentString,
				});
				if (character === "(") {
					array.push({
						category: categories.operator,
						operator: operators.invisibleTimes,
					});
				}
			} else if (previousCharacterCategory === characterCategories.letters) {

				const { keyword, type: keywordType, ...keywordProperties } = keywordList.find(({ keyword }) => currentString === keyword) ?? {};
				// @ts-ignore
				const /** @type {string} */ string = keywordType === keywordTypes.specialCharacter ? keywordProperties.character : currentString;

				if (keywordType !== keywordTypes.normal) {
					const whitespaceBefore = array.at(-1)?.category === categories.whitespace;
					const relativeIndex = -1 - +whitespaceBefore;

					if (
						[categories.number, categories.variable].includes(array.at(relativeIndex)?.category)
						||
						(array.at(relativeIndex)?.category === categories.anyClosingBracket && array.at(relativeIndex)?.anyBracketType === allBrackets.parenthesis)
						||
						(array.at(relativeIndex)?.category === categories.operator && postfixOperators.includes(array.at(relativeIndex)?.operator))
					) {
						array.push({
							category: categories.operator,
							operator: operators.invisibleTimes,
						});
						if (whitespaceBefore) {
							array.push({
								category: categories.whitespace,
							});
						}
					}
				}

				if (keywordType === keywordTypes.normal || (keywordType === keywordTypes.function && character === "(")) {
					array.push({
						category: categories.keyword,
						// @ts-ignore
						keywordName: keywordProperties.name,
						keywordType,
					});
				} else if (character === "(") {
					array.push({
						category: categories.function,
						functionName: string,
					});
				} else {
					for (const [characterIndex, character] of [...string].entries()) {
						if (characterIndex > 0) {
							array.push({
								category: categories.operator,
								operator: operators.invisibleTimes,
							});
						}
						array.push({
							category: categories.variable,
							variable: character,
						});
					}

					if (characterCategory === characterCategories.number) {
						array.push({
							category: categories.operator,
							operator: operators.index,
							groupsNotMatched: true,
						});
					}
				}
			}

			currentString = "";
		}

		currentString += character;

		previousCharacterCategory = characterCategory;
	}

	return array;
};
