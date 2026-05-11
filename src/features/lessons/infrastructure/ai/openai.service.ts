import OpenAI from "openai";
import { env } from "../../../../config/env";
import { buildCacheKey } from "../../../../utils/cacheKey";
import { selectPolicy } from "../../../../utils/selectPlicy";
import type { CacheService } from "../cache/cache.service";

export class OpenAIService {
	private openai: OpenAI;
	constructor(private cacheService: CacheService) {
		this.openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
		});
	}
	// Initialize any necessary properties or configurations here

	async generate(type: string, prompt: string) {
		const policy = selectPolicy(prompt);
		const key = buildCacheKey(type, prompt);

		if (policy.validateInput && !policy.validateInput(prompt)) {
			throw new Error("Input does not meet the policy requirements.");
		}

		try {
			// Check cache first
			const cached = await this.cacheService.get(key);
			if (cached) {
				return { data: cached, source: "cache" };
			}

			// Generate response from OpenAI
			const response = await this.openai.chat.completions.create({
				model: env.OPENAI_FAST_MODEL,
				max_completion_tokens: 1500,
				temperature: 0.5,
				messages: [
					{ role: "system", content: policy.systemPrompt },
					{ role: "user", content: prompt },
				],
			});

			// Verify response structure
			if (!response.choices[0] || response.choices.length === 0) {
				throw new Error("No choices returned");
			}

			const choice = response.choices[0];

			// Verify message content
			if (!choice.message || !choice.message.content) {
				throw new Error("Invalid response structure");
			}

			//output validation
			if (
				policy.validateOutput &&
				!policy.validateOutput(choice.message.content)
			) {
				throw new Error("Output does not meet the policy requirements.");
			}

			const result = choice.message.content;

			// Cache the result
			await this.cacheService.set(key, result, env.CACHE_TTL);

			return { data: choice.message.content, source: "openai" };
		} catch (error) {
			console.error("Error generating response from OpenAI:", error);
			throw error;
		}
	}
}
