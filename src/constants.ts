
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
	colon: "colon",
	power: "power",
	root: "root",
	squareRoot: "squareRoot",
	invisibleTimes: "invisibleTimes",
	index: "index",
	integral: "integral",
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
		syntax: ":",
		name: operators.colon,
		character: "∶",
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
