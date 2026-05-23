import type { NextFunction, Request, Response } from "express";
import { supabase } from "../core/db/supabaseClient.ts";
import { redis } from "../core/cache/redis.ts";
import { SubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";
import { GetActiveSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetActiveSubscription.usecase.ts";

const subscriptionRepo = new SubscriptionRepoImpl(supabase);
const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
const getActiveSubscription = new GetActiveSubscriptionUseCase(subscriptionRepo, orgSubRepo);

const SUB_CACHE_TTL = 60; // seconds — short enough to reflect cancellations promptly

export const requireProMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const userId = req.userId;

	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	const cacheKey = `sub:pro:${userId}`;
	const cached = await redis.get(cacheKey);

	if (cached !== null) {
		if (cached === "pro") {
			next();
		} else {
			res.status(402).json({ error: "Pro subscription required" });
		}
		return;
	}

	const plan = await getActiveSubscription.execute(userId);
	await redis.set(cacheKey, plan ?? "free", "EX", SUB_CACHE_TTL);

	if (plan !== "pro") {
		res.status(402).json({ error: "Pro subscription required" });
		return;
	}

	next();
};
