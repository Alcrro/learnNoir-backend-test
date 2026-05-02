import { redis } from "../../../../core/cache/redis";
import { OpenAIService } from "../../infrastructure/ai/openai.service";
import { CacheService } from "../../infrastructure/cache/cache.service";

export function createServices() {
	const cachedService = new CacheService(redis);
	const openAIService = new OpenAIService(cachedService);

	return {
		openAIService,
	};
}
