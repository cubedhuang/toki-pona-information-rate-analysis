const MORA = true;

const syllables = /[ptkmnlwsj]?[aeiou](?:n(?![aeiou]))?/gim;

export function getSyllableInformation(text: string) {
	let matches: string[] | null = text.match(syllables);

	if (!matches) {
		throw new Error("No matches found");
	}

	if (MORA) {
		matches = matches
			.map(syllable => {
				if (syllable.endsWith("n")) {
					return [syllable.slice(0, -1), "n"];
				}

				return syllable;
			})
			.flat();
	}

	const frequencies = new Map<string, number>();

	for (const match of matches) {
		const key = match.toLowerCase();

		if (["wu", "wo", "ji", "ti"].some(s => key.startsWith(s))) {
			continue;
		}

		const count = frequencies.get(key) || 0;
		frequencies.set(key, count + 1);
	}

	return { frequencies, totalCount: matches.length };
}

export function getInformationContent(text: string) {
	const { frequencies, totalCount } = getSyllableInformation(text);

	const informationContent = new Map<string, number>();
	let entropy = 0;

	for (const [syllable, count] of frequencies.entries()) {
		const probability = count / totalCount;
		const information = -Math.log2(probability);
		informationContent.set(syllable, information);

		entropy += probability * information;
	}

	return { informationContent, entropy };
}
