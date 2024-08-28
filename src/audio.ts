import ffmpeg, { FfprobeFormat, FfprobeStream } from "fluent-ffmpeg";
import { promisify } from "node:util";

const ffprobeAsync = promisify<
	string,
	{
		streams: FfprobeStream[];
		format: FfprobeFormat;
		chapters: any[];
	}
>(ffmpeg.ffprobe as any);

export async function analyzeAudio(
	audioFile: string
): Promise<{ totalDuration: number; pauseDuration: number }> {
	try {
		const metadata = await ffprobeAsync(audioFile);
		const totalDuration = (metadata.format.duration || 0) - 6;

		// Note: Detecting pauses accurately would require more complex processing
		// For now, we'll estimate pause duration based on a simple threshold
		const silenceDetectionOutput = await detectSilence(audioFile);
		const pauseDuration = calculatePauseDuration(silenceDetectionOutput);

		return {
			totalDuration,
			pauseDuration
		};
	} catch (error) {
		console.error("Error analyzing audio:", error);
		return { totalDuration: 0, pauseDuration: 0 };
	}
}

async function detectSilence(audioFile: string): Promise<string> {
	return new Promise((resolve, reject) => {
		let output = "";

		ffmpeg(audioFile)
			.audioFilters("silencedetect=noise=-40dB:d=0.15")
			.outputOptions("-f null")
			.output("-")
			.on("stderr", stderrLine => {
				output += stderrLine + "\n";
			})
			.on("error", reject)
			.on("end", () => resolve(output))
			.run();
	});
}

function calculatePauseDuration(ffmpegOutput: string): number {
	const silenceMatches = ffmpegOutput.match(
		/silence_duration: (\d+(\.\d+)?)/g
	);
	if (!silenceMatches) return 0;

	return silenceMatches.reduce((total, match) => {
		const duration = parseFloat(match.split(":")[1]);
		return total + duration;
	}, 0);
}
