import OpenAI from "openai";
import { env } from "../../../../config/env.js";
import { buildCacheKey } from "../../../../utils/cacheKey.js";
import { selectPolicy } from "../../../../utils/selectPlicy.js";
import type { CacheService } from "../cache/cache.service.js";
import { logger } from "../../../../core/logger.js";

const OPENAI_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;

export class OpenAIService {
	private openai: OpenAI;

	constructor(private cacheService: CacheService) {
		this.openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			timeout: OPENAI_TIMEOUT_MS,
			maxRetries: MAX_RETRIES,
		});
	}

	async generate(type: string, prompt: string) {
		const policy = selectPolicy(prompt);
		const key = buildCacheKey(type, prompt);

		if (policy.validateInput && !policy.validateInput(prompt)) {
			throw new Error("Input does not meet the policy requirements.");
		}

		const cached = await this.cacheService.get(key);
		if (cached) {
			return { data: cached, source: "cache" };
		}

		try {
			const response = await this.openai.chat.completions.create({
				model: env.OPENAI_FAST_MODEL,
				max_completion_tokens: 1500,
				temperature: 0.5,
				messages: [
					{ role: "system", content: policy.systemPrompt },
					{ role: "user", content: prompt },
				],
			});

			if (!response.choices[0] || response.choices.length === 0) {
				throw new Error("No choices returned");
			}

			const choice = response.choices[0];

			if (!choice.message?.content) {
				throw new Error("Invalid response structure");
			}

			if (policy.validateOutput && !policy.validateOutput(choice.message.content)) {
				throw new Error("Output does not meet the policy requirements.");
			}

			await this.cacheService.set(key, choice.message.content, env.CACHE_TTL);

			return { data: choice.message.content, source: "openai" };
		} catch (error) {
			logger.error({ error }, "OpenAI generation failed");
			throw error;
		}
	}
}
