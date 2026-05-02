import Redis from "ioredis";

export class CacheService {
	// Implementation for cache service
	constructor(private redis: Redis) {
		// Initialize cache properties or configurations here
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (ttl) {
			await this.redis.set(key, JSON.stringify(value), "EX", ttl);
		} else {
			await this.redis.set(key, JSON.stringify(value));
		}
	}

	async get(key: string): Promise<string | null> {
		const value = await this.redis.get(key);
		return value ? JSON.parse(value) : null;
	}
}
