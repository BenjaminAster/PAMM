
export const characterCategories = new class {
	number = "number";
	identifier = "identifier";
	operator = "operator";
	anyOpeningBracket = "anyOpeningBracket"; // ( [ {
	anyClosingBracket = "anyClosingBracket"; // ) ] }
	whitespace = "whitespace";
};

const regularExpressions = new class {
	number = /[\d]/;
	identifier = /[a-zA-Z]/;
	operator = /[+-/*#^=]/;
	anyOpeningBracket = /[([{]/;
	anyClosingBracket = /[)\]}]/;
	whitespace = /[\s]/;
};


export default (/** @type {string} */ mathString) => {
	mathString = mathString.trim() + " ";
	const /** @type {any[]} */ array = [];
	let currentString = "";
	let /** @type {string} */ previousCharacterCategory;

	for (const character of mathString) {
		const characterCategory = (() => {
			if (character.match(regularExpressions.number)) return characterCategories.number;
			if (character.match(regularExpressions.identifier)) return characterCategories.identifier;
			if (character.match(regularExpressions.operator)) return characterCategories.operator;
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
		}

		currentString += character;

		previousCharacterCategory = characterCategory;
	}

	array.push({
		characterCategory: characterCategories.whitespace,
	});
	array.unshift({
		characterCategory: characterCategories.whitespace,
	});

	return array;
};
