import type { NextFunction, Request, Response } from "express";
import { supabase } from "../core/db/supabaseClient.ts";
import { redis } from "../core/cache/redis.ts";
import { SubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";
import { GetActiveSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetActiveSubscription.usecase.ts";

const subscriptionRepo = new SubscriptionRepoImpl(supabase);
const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
const getActiveSubscription = new GetActiveSubscriptionUseCase(subscriptionRepo, orgSubRepo);

const SUB_CACHE_TTL = 60;

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

	// Admins and teachers always have full access
	if (req.userRole === "admin" || req.userRole === "teacher") {
		next();
		return;
	}

	const cacheKey = `sub:is_pro:${userId}`;
	const cached = await redis.get(cacheKey);

	if (cached !== null) {
		if (cached === "1") {
			next();
		} else {
			res.status(402).json({ error: "Pro subscription required" });
		}
		return;
	}

	const { pro } = await getActiveSubscription.execute(userId);
	await redis.set(cacheKey, pro ? "1" : "0", "EX", SUB_CACHE_TTL);

	if (!pro) {
		res.status(402).json({ error: "Pro subscription required" });
		return;
	}

	next();
};
