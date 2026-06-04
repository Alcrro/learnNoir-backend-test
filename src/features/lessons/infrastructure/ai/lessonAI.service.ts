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
import { lessonPrompts } from "./lessonPrompts.ts";
import type { CacheService } from "../cache/cache.service.ts";
import { buildCacheKey } from "../../../../utils/cacheKey.ts";

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

	constructor(private cache?: CacheService) {
		this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	// Returns a short text field (title / description) or plain-text content summary.
	// For structured block generation use generateStructuredBlocks().
	async generateContent(topic: string, field: "title" | "description" | "content"): Promise<string> {
		const configs: Record<typeof field, { prompt: string; model: string; maxTokens: number; temperature: number }> = {
			title: { prompt: lessonPrompts.title(topic), model: env.OPENAI_FAST_MODEL, maxTokens: 100, temperature: 0.7 },
			description: { prompt: lessonPrompts.description(topic), model: env.OPENAI_FAST_MODEL, maxTokens: 300, temperature: 0.7 },
			content: { prompt: lessonPrompts.content(topic), model: env.OPENAI_CONTENT_MODEL, maxTokens: 2000, temperature: 0.5 },
		};

		const cfg = configs[field];
		return this.callText(lessonGeneratePolicy.systemPrompt, cfg.prompt, cfg.model, cfg.maxTokens, cfg.temperature, buildCacheKey(`lesson:${field}`, cfg.prompt));
	}

	// Generates a structured array of LessonContentNode blocks for a topic.
	// These can be directly stored as a ContentLessonBlock.data.content array.
	async generateStructuredBlocks(
		topic: string,
		lessonContext?: { title?: string; description?: string },
	): Promise<LessonContentNode[]> {
		const prompt = lessonPrompts.structuredBlocks(topic, lessonContext);

		const raw = await this.callJson(
			lessonStructuredContentPolicy.systemPrompt,
			prompt,
			env.OPENAI_CONTENT_MODEL,
			3000,
			0.4,
			buildCacheKey("lesson:blocks", prompt),
		);

		// Policy instructs model to return { "nodes": [...] }
		if (!Array.isArray(raw) && Array.isArray(raw["nodes"])) {
			return raw["nodes"] as LessonContentNode[];
		}
		if (Array.isArray(raw)) return raw as LessonContentNode[];
		return [];
	}

	async improveText(text: string, context?: string): Promise<string> {
		const prompt = lessonPrompts.improveText(text, context);
		return this.callText(lessonImprovePolicy.systemPrompt, prompt, env.OPENAI_CONTENT_MODEL, 2000, 0.6, buildCacheKey("lesson:improve", prompt));
	}

	async reviewLesson(lesson: { title: string; description: string; content: string }): Promise<LessonReviewResult> {
		const prompt = lessonPrompts.reviewLesson(lesson);
		const raw = await this.callJson(lessonReviewPolicy.systemPrompt, prompt, env.OPENAI_FAST_MODEL, 800, 0.3, buildCacheKey("lesson:review", prompt));
		const obj = Array.isArray(raw) ? {} : raw;

		return {
			clarity: typeof obj["clarity"] === "number" ? obj["clarity"] : 3,
			accuracy: typeof obj["accuracy"] === "string" ? obj["accuracy"] : "",
			completeness: typeof obj["completeness"] === "string" ? obj["completeness"] : "",
			suggestions: Array.isArray(obj["suggestions"]) ? (obj["suggestions"] as string[]) : [],
		};
	}

	async generateMetadata(title: string, moduleName: string): Promise<{ description: string; durationMinutes: number }> {
		const prompt = lessonPrompts.generateMetadata(title, moduleName);
		const raw = await this.callJson(lessonMetadataPolicy.systemPrompt, prompt, env.OPENAI_FAST_MODEL, 200, 0.4, buildCacheKey("lesson:metadata", prompt));
		const obj = Array.isArray(raw) ? {} : raw;
		return {
			description: typeof obj["description"] === "string" ? obj["description"] : "",
			durationMinutes: Math.round(Math.max(10, Math.min(120, typeof obj["durationMinutes"] === "number" ? obj["durationMinutes"] : 30))),
		};
	}

	async generateQuizQuestions(content: string, count = 3): Promise<QuizQuestion[]> {
		const prompt = lessonPrompts.generateQuizQuestions(content, count);
		const raw = await this.callJson(lessonQuizPolicy.systemPrompt, prompt, env.OPENAI_CONTENT_MODEL, 2000, 0.5, buildCacheKey(`lesson:quiz:${count}`, prompt));

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
		cacheKey?: string,
	): Promise<string> {
		if (cacheKey && this.cache) {
			const cached = await this.cache.get(cacheKey);
			if (cached) return cached;
		}

		const response = await this.openai.chat.completions.create({
			model,
			max_completion_tokens: maxTokens,
			temperature,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		const result = response.choices[0]?.message?.content?.trim() ?? "";

		if (cacheKey && this.cache && result) {
			await this.cache.set(cacheKey, result, env.CACHE_TTL);
		}

		return result;
	}

	private async callJson(
		systemPrompt: string,
		userPrompt: string,
		model: string,
		maxTokens: number,
		temperature: number,
		cacheKey?: string,
	): Promise<Record<string, unknown> | unknown[]> {
		if (cacheKey && this.cache) {
			const cached = await this.cache.get(cacheKey);
			if (cached) {
				try {
					return JSON.parse(cached) as Record<string, unknown> | unknown[];
				} catch {
					// cache corrupted — proceed with API call
				}
			}
		}

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

		if (cacheKey && this.cache) {
			await this.cache.set(cacheKey, text, env.CACHE_TTL);
		}

		try {
			return JSON.parse(text) as Record<string, unknown> | unknown[];
		} catch {
			return {};
		}
	}
}
