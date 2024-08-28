import { readFile } from "node:fs/promises";

import { analyzeAudio } from "./audio.js";
import {
	getInformationContent,
	getSyllableInformation
} from "./information.js";

const CORPORA = [
	"data/ks02.txt",
	"data/ks04.txt",
	"data/ks07.txt",
	"data/ks10.txt"
];

const TEXT_FILES = ["data/ks02.txt", "data/ks07.txt"];
const AUDIO_FILES = ["data/ks02.mp3", "data/ks07.mp3"];

const rowCorpus = (
	await Promise.all(CORPORA.map(file => readFile(file, "utf-8")))
).join("\n");

function cleanText(text: string) {
	return text
		.split("\n")
		.filter(line => line.length > 0)
		.map(line => {
			const match = line.match(/^.{1,3}: (.*)/i);
			if (match) {
				return match[1];
			}

			return line;
		})
		.join(" ");
}

const corpus = cleanText(rowCorpus);

const { informationContent, entropy } = getInformationContent(corpus);

console.log("\nInformation content (bits):");
console.log([...informationContent.entries()].sort((a, b) => b[1] - a[1]));

console.log(
	`\nWeighted average information per syllable: ${entropy.toFixed(2)} bits`
);

const targetInformationRate = 39; // bits per second, based on the study
const theoreticalSpeechRate = targetInformationRate / entropy;
console.log(
	`\nTheoretical speech rate to achieve ${targetInformationRate} bits/second: ${theoreticalSpeechRate.toFixed(
		2
	)} syllables/second`
);

// Calculate actual speech rate

const texts = (
	await Promise.all(TEXT_FILES.map(file => readFile(file, "utf-8")))
).join("\n");

const { totalCount } = getSyllableInformation(texts);

const datas = await Promise.all(AUDIO_FILES.map(analyzeAudio));

const totalDuration = datas.reduce((acc, data) => acc + data.totalDuration, 0);
const totalPauseDuration = datas.reduce(
	(acc, data) => acc + data.pauseDuration,
	0
);
const effectiveSpeechDuration = totalDuration - totalPauseDuration;

console.log(`\nTotal syllable count: ${totalCount}`);
console.log(`Total duration: ${totalDuration.toFixed(2)} seconds`);
console.log(`Total pause duration: ${totalPauseDuration.toFixed(2)} seconds`);
console.log(
	`Effective speech duration: ${effectiveSpeechDuration.toFixed(2)} seconds`
);

const actualSpeechRate = totalCount / effectiveSpeechDuration;
const actualBitsPerSecond = actualSpeechRate * entropy;

console.log(
	`\nActual speech rate: ${actualSpeechRate.toFixed(2)} syllables/second`
);
console.log(
	`Actual information rate: ${actualBitsPerSecond.toFixed(2)} bits/second`
);
