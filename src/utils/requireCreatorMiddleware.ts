import type { NextFunction, Request, Response } from "express";
import { supabase } from "../core/db/supabaseClient.ts";
import { redis } from "../core/cache/redis.ts";
import { SubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";
import { GetActiveSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetActiveSubscription.usecase.ts";

const subscriptionRepo = new SubscriptionRepoImpl(supabase);
const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
const getActiveSubscription = new GetActiveSubscriptionUseCase(subscriptionRepo, orgSubRepo);

const CREATOR_CACHE_TTL = 60;

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

	const cacheKey = `sub:is_creator:${userId}`;
	const cached = await redis.get(cacheKey);

	if (cached !== null) {
		if (cached === "1") {
			next();
		} else {
			res.status(403).json({ error: "Creator plan required" });
		}
		return;
	}

	const { creator } = await getActiveSubscription.execute(userId);
	await redis.set(cacheKey, creator ? "1" : "0", "EX", CREATOR_CACHE_TTL);

	if (!creator) {
		res.status(403).json({ error: "Creator plan required" });
		return;
	}

	next();
};
