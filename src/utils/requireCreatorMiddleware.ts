import type { NextFunction, Request, Response } from "express";
import { supabase } from "../core/db/supabaseClient.ts";
import { redis } from "../core/cache/redis.ts";
import { CreatorSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/CreatorSubscriptionRepoImpl.ts";
import { GetCreatorSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetCreatorSubscription.usecase.ts";

const creatorRepo = new CreatorSubscriptionRepoImpl(supabase);
const getCreatorSubscription = new GetCreatorSubscriptionUseCase(creatorRepo);

const CREATOR_CACHE_TTL = 60; // seconds

export const requireCreatorMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const userId = req.userId;

	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	const cacheKey = `sub:creator:${userId}`;
	const cached = await redis.get(cacheKey);

	if (cached !== null) {
		if (cached === "1") {
			next();
		} else {
			res.status(402).json({ error: "Creator plan required" });
		}
		return;
	}

	const isCreator = await getCreatorSubscription.execute(userId);
	await redis.set(cacheKey, isCreator ? "1" : "0", "EX", CREATOR_CACHE_TTL);

	if (!isCreator) {
		res.status(402).json({ error: "Creator plan required" });
		return;
	}

	next();
};
