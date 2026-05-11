import OpenAI from "openai";
import { env } from "../../../../config/env.ts";
import { lessonNarrationPolicy } from "../../../../policy/promptPolicies.ts";
import type { AudioSegment } from "../../domain/types/lessonAudio.types.ts";

const WORDS_PER_MS = 140 / 60_000;

type ContentNode = Record<string, unknown>;

function extractText(nodes: ContentNode[]): string {
	const parts: string[] = [];

	for (const node of nodes) {
		switch (node["type"]) {
			case "concept": {
				const title = node["title"];
				const sections = node["sections"];
				if (typeof title === "string") parts.push(title);
				if (Array.isArray(sections)) {
					for (const s of sections as Record<string, unknown>[]) {
						if (typeof s["label"] === "string") parts.push(s["label"]);
						if (typeof s["text"] === "string") parts.push(s["text"]);
					}
				}
				break;
			}
			case "steps": {
				const steps = node["steps"];
				if (Array.isArray(steps)) {
					for (const step of steps as Record<string, unknown>[]) {
						if (typeof step["title"] === "string") parts.push(step["title"]);
						const content = step["content"];
						if (Array.isArray(content)) {
							for (const c of content as Record<string, unknown>[]) {
								if (typeof c["text"] === "string") parts.push(c["text"]);
								if (typeof c["code"] === "string") parts.push(c["code"]);
							}
						}
					}
				}
				break;
			}
			case "theorem": {
				if (typeof node["title"] === "string") parts.push(node["title"]);
				if (typeof node["statement"] === "string") parts.push(node["statement"]);
				break;
			}
			case "proof": {
				const steps = node["steps"];
				if (Array.isArray(steps)) {
					for (const s of steps as Record<string, unknown>[]) {
						if (typeof s["text"] === "string") parts.push(s["text"]);
					}
				}
				break;
			}
			case "complexity": {
				const cases = node["cases"];
				if (Array.isArray(cases)) {
					for (const c of cases as Record<string, unknown>[]) {
						if (typeof c["description"] === "string") parts.push(c["description"]);
					}
				}
				break;
			}
			case "formula": {
				if (typeof node["description"] === "string") parts.push(node["description"]);
				break;
			}
			case "example": {
				const states = node["states"];
				if (Array.isArray(states)) {
					for (const s of states as Record<string, unknown>[]) {
						if (typeof s["action"] === "string") parts.push(s["action"]);
					}
				}
				break;
			}
		}
	}

	return parts.join("\n\n");
}

function segmentScript(script: string): AudioSegment[] {
	const paragraphs = script
		.split(/\n+/)
		.map((p) => p.trim())
		.filter((p) => p.length > 0);

	const segments: AudioSegment[] = [];
	let cursor = 0;

	for (const text of paragraphs) {
		const wordCount = text.split(/\s+/).length;
		const duration = Math.round(wordCount / WORDS_PER_MS);
		segments.push({ text, start_ms: cursor, end_ms: cursor + duration });
		cursor += duration;
	}

	return segments;
}

export class LessonAudioAIService {
	private openai: OpenAI;

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async generateScript(contentNodes: ContentNode[]): Promise<AudioSegment[]> {
		const raw = extractText(contentNodes);

		if (raw.trim().length < 20) {
			throw new Error("Lesson content is too short or could not be extracted for audio generation");
		}

		const response = await this.openai.chat.completions.create({
			model: env.OPENAI_FAST_MODEL,
			max_completion_tokens: 2500,
			temperature: 0.6,
			messages: [
				{ role: "system", content: lessonNarrationPolicy.systemPrompt },
				{ role: "user", content: `Transform this lesson content into an audio narration:\n\n${raw}` },
			],
		});

		const script = response.choices[0]?.message?.content?.trim() ?? "";
		if (lessonNarrationPolicy.validateOutput && !lessonNarrationPolicy.validateOutput(script)) {
			throw new Error("Generated script failed validation");
		}

		return segmentScript(script);
	}

	async generateAudio(segments: AudioSegment[]): Promise<Buffer> {
		const fullScript = segments.map((s) => s.text).join("\n\n");

		const mp3 = await this.openai.audio.speech.create({
			model: env.OPENAI_TTS_MODEL,
			voice: env.OPENAI_TTS_VOICE,
			input: fullScript,
			response_format: "mp3",
		});

		return Buffer.from(await mp3.arrayBuffer());
	}
}
