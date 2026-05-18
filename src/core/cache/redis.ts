import Redis from "ioredis";
import { env } from "../../config/env.js";
import { logger } from "../logger.js";

export const redis = new Redis(env.REDIS_URL!, {
	retryStrategy(times) {
		if (times > 5) return null;
		return 500;
	},
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", (err) => logger.error({ err }, "Redis error"));
