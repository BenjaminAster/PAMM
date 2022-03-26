
export const characterCategories = new class {
	number = "number";
	letters = "letters";
	symbols = "symbols";
	anyOpeningBracket = "anyOpeningBracket"; // ( [ {
	anyClosingBracket = "anyClosingBracket"; // ) ] }
	whitespace = "whitespace";
};

const regularExpressions = new class {
	number = /[\d\.]/;
	letters = /[a-zA-Z]/;
	symbols = /[+-/*#=_]/;
	anyOpeningBracket = /[([{]/;
	anyClosingBracket = /[)\]}]/;
	whitespace = /[\s]/;
};


export default (/** @type {string} */ mathString) => {
	mathString = " " + mathString.trim() + " ";
	const /** @type {any[]} */ array = [];
	let currentString = "";
	let /** @type {string} */ previousCharacterCategory;

	for (const character of mathString) {
		const characterCategory = (() => {
			if (character.match(regularExpressions.number)) return characterCategories.number;
			if (character.match(regularExpressions.letters)) return characterCategories.letters;
			if (character.match(regularExpressions.symbols)) return characterCategories.symbols;
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
