import OpenAI from "openai";
import { env } from "../../../../config/env.ts";
import {
	lessonGeneratePolicy,
	lessonImprovePolicy,
	lessonMetadataPolicy,
	lessonReviewPolicy,
	lessonQuizPolicy,
	lessonStructuredContentPolicy,
} from "../../../../policy/promptPolicies.ts";
import type { LessonContentNode } from "@shared/lesson-block";

export type LessonReviewResult = {
	clarity: number;
	accuracy: string;
	completeness: string;
	suggestions: string[];
};

export type QuizQuestion = {
	question: string;
	options: [string, string, string, string];
	correctIndex: number;
	explanation: string;
};

export class LessonAIService {
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	// Returns a short text field (title / description) or plain-text content summary.
	// For structured block generation use generateStructuredBlocks().
	async generateContent(topic: string, field: "title" | "description" | "content"): Promise<string> {
		const configs: Record<typeof field, { prompt: string; model: string; maxTokens: number; temperature: number }> = {
			title: {
				prompt: `Write a concise, descriptive lesson title (max 70 characters) for the topic: "${topic}". Return only the title, no quotes.`,
				model: env.OPENAI_FAST_MODEL,
				maxTokens: 100,
				temperature: 0.7,
			},
			description: {
				prompt: `Write a 2–3 sentence lesson description for the topic: "${topic}". Explain what the student will learn and why it matters. Be specific and engaging. Return only the description.`,
				model: env.OPENAI_FAST_MODEL,
				maxTokens: 300,
				temperature: 0.7,
			},
			content: {
				prompt: `Write the main theory content for a lesson about "${topic}". Use clear headings and structured explanations covering: what it is, how it works, key properties, and real-world relevance. Target an intermediate-level CS student. Max 600 words.`,
				model: env.OPENAI_CONTENT_MODEL,
				maxTokens: 2000,
				temperature: 0.5,
			},
		};

		const cfg = configs[field];
		return this.callText(lessonGeneratePolicy.systemPrompt, cfg.prompt, cfg.model, cfg.maxTokens, cfg.temperature);
	}

	// Generates a structured array of LessonContentNode blocks for a topic.
	// These can be directly stored as a ContentLessonBlock.data.content array.
	async generateStructuredBlocks(topic: string): Promise<LessonContentNode[]> {
		const prompt = `Generate a complete structured lesson about "${topic}". Cover: the concept definition, step-by-step explanation, and time/space complexity if applicable.`;

		const raw = await this.callJson(
			lessonStructuredContentPolicy.systemPrompt,
			prompt,
			env.OPENAI_CONTENT_MODEL,
			3000,
			0.4,
		);

		// Policy instructs model to return { "nodes": [...] }
		if (!Array.isArray(raw) && Array.isArray(raw["nodes"])) {
			return raw["nodes"] as LessonContentNode[];
		}
		if (Array.isArray(raw)) return raw as LessonContentNode[];
		return [];
	}

	async improveText(text: string, context?: string): Promise<string> {
		const prompt = context
			? `Context: ${context}\n\nText to improve:\n${text}`
			: `Text to improve:\n${text}`;

		return this.callText(lessonImprovePolicy.systemPrompt, prompt, env.OPENAI_CONTENT_MODEL, 2000, 0.6);
	}

	async reviewLesson(lesson: { title: string; description: string; content: string }): Promise<LessonReviewResult> {
		const prompt = `Review this lesson:\n\nTitle: ${lesson.title}\nDescription: ${lesson.description}\n\nContent:\n${lesson.content}`;
		const raw = await this.callJson(lessonReviewPolicy.systemPrompt, prompt, env.OPENAI_FAST_MODEL, 800, 0.3);
		const obj = Array.isArray(raw) ? {} : raw;

		return {
			clarity: typeof obj["clarity"] === "number" ? obj["clarity"] : 3,
			accuracy: typeof obj["accuracy"] === "string" ? obj["accuracy"] : "",
			completeness: typeof obj["completeness"] === "string" ? obj["completeness"] : "",
			suggestions: Array.isArray(obj["suggestions"]) ? (obj["suggestions"] as string[]) : [],
		};
	}

	async generateMetadata(title: string, moduleName: string): Promise<{ description: string; durationMinutes: number }> {
		const prompt = `Lesson title: "${title}"\nModule: "${moduleName}"\n\nReturn JSON: { "description": "...", "durationMinutes": <integer> }`;
		const raw = await this.callJson(lessonMetadataPolicy.systemPrompt, prompt, env.OPENAI_FAST_MODEL, 200, 0.4);
		const obj = Array.isArray(raw) ? {} : raw;
		return {
			description: typeof obj["description"] === "string" ? obj["description"] : "",
			durationMinutes: Math.round(Math.max(10, Math.min(120, typeof obj["durationMinutes"] === "number" ? obj["durationMinutes"] : 30))),
		};
	}

	async generateQuizQuestions(content: string, count = 3): Promise<QuizQuestion[]> {
		const prompt = `Generate ${count} multiple-choice questions for this lesson content:\n\n${content}`;
		const raw = await this.callJson(lessonQuizPolicy.systemPrompt, prompt, env.OPENAI_CONTENT_MODEL, 2000, 0.5);

		if (!Array.isArray(raw)) return [];

		return (raw as unknown[]).slice(0, count).flatMap((item) => {
			if (typeof item !== "object" || item === null) return [];
			const q = item as Record<string, unknown>;
			if (
				typeof q["question"] !== "string" ||
				!Array.isArray(q["options"]) ||
				typeof q["correctIndex"] !== "number"
			) {
				return [];
			}
			return [{
				question: q["question"],
				options: (q["options"] as string[]).slice(0, 4) as [string, string, string, string],
				correctIndex: q["correctIndex"],
				explanation: typeof q["explanation"] === "string" ? q["explanation"] : "",
			}];
		});
	}

	private async callText(
		systemPrompt: string,
		userPrompt: string,
		model: string,
		maxTokens: number,
		temperature: number,
	): Promise<string> {
		const response = await this.openai.chat.completions.create({
			model,
			max_completion_tokens: maxTokens,
			temperature,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		return response.choices[0]?.message?.content?.trim() ?? "";
	}

	private async callJson(
		systemPrompt: string,
		userPrompt: string,
		model: string,
		maxTokens: number,
		temperature: number,
	): Promise<Record<string, unknown> | unknown[]> {
		const response = await this.openai.chat.completions.create({
			model,
			max_completion_tokens: maxTokens,
			temperature,
			response_format: { type: "json_object" },
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		const text = response.choices[0]?.message?.content ?? "{}";
		try {
			return JSON.parse(text) as Record<string, unknown> | unknown[];
		} catch {
			return {};
		}
	}
}
