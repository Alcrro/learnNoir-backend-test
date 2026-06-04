import OpenAI from "openai";
import { env } from "../../../../config/env.ts";
import { redis } from "../../../../core/cache/redis.ts";
import { theoryLevelExplanationPolicy } from "../../../../policy/promptPolicies.ts";
import type { ExplanationLevel } from "../../domain/types/TheoryLevelExplanation.type.ts";

export class TheoryLevelAIService {
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	async generateExplanation(
		lessonBlockId: string,
		level: ExplanationLevel,
		theoryContent: string,
		lessonTitle: string,
		forceRefresh = false,
	): Promise<string> {
		const cacheKey = `theory-level:${lessonBlockId}:${level}`;

		if (!forceRefresh) {
			const cached = await redis.get(cacheKey);
			if (cached) return cached;
		}

		const systemPrompt = theoryLevelExplanationPolicy.buildSystemPrompt(level);
		const userPrompt = `Titlu lecție: ${lessonTitle}\n\nConținut original:\n${theoryContent}\n\nGenerează explicația pentru nivelul: ${level}`;

		const response = await this.openai.chat.completions.create({
			model: theoryLevelExplanationPolicy.model,
			max_completion_tokens: theoryLevelExplanationPolicy.maxTokens,
			temperature: theoryLevelExplanationPolicy.temperature,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		const content = response.choices[0]?.message?.content ?? "";

		await redis.set(cacheKey, content, "EX", theoryLevelExplanationPolicy.cacheTTLSeconds);

		return content;
	}
}
