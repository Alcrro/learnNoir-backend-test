import Redis from "ioredis";
import { env } from "../../config/env";

export const redis = new Redis(env.REDIS_URL!, {
	retryStrategy(times) {
		if (times > 5) return null;
		return 500;
	},
});
redis.on("connect", () => {
	console.log("Redis connected");
});

redis.on("ready", () => {
	console.log("Redis ready");
});
redis.on("error", (err) => {
	console.error("Redis error:", err);
});
