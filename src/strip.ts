import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function removeSilence(
	inputFile: string,
	outputFile: string
): Promise<void> {
	const command = `ffmpeg -i "${inputFile}" -af silenceremove=stop_periods=-1:stop_duration=0.15:stop_threshold=-40dB "${outputFile}"`;

	try {
		const { stdout, stderr } = await execAsync(command);
		console.log("Silence removal completed");
		console.log("FFmpeg output:", stderr);
	} catch (error) {
		console.error("Error removing silence:", error);
	}
}

async function main() {
	const inputFile = "data/ks07.mp3";
	const outputFile = "data/ks07-stripped.mp3";

	await removeSilence(inputFile, outputFile);
	console.log(`Processed audio saved to: ${outputFile}`);
}

main().catch(console.error);
