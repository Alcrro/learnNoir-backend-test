import type { NextFunction, Request, Response } from "express";
import { supabase } from "../core/db/supabaseClient.ts";
import { SubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";
import { GetActiveSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetActiveSubscription.usecase.ts";

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

	const repo = new SubscriptionRepoImpl(supabase);
	const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
	const useCase = new GetActiveSubscriptionUseCase(repo, orgSubRepo);
	const plan = await useCase.execute(userId);

	if (plan !== "pro") {
		res.status(402).json({ error: "Pro subscription required" });
		return;
	}

	next();
};
