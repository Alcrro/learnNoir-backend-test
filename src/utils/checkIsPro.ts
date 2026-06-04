import { redis } from "../core/cache/redis.ts";
import { supabase } from "../core/db/supabaseClient.ts";
import { GetActiveSubscriptionUseCase } from "../features/subscriptions/application/useCases/GetActiveSubscription.usecase.ts";
import { SubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";

const subscriptionRepo = new SubscriptionRepoImpl(supabase);
const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
const getActiveSubscription = new GetActiveSubscriptionUseCase(subscriptionRepo, orgSubRepo);

const SUB_CACHE_TTL = 60;

export async function checkIsPro(userId: string): Promise<boolean> {
	const cacheKey = `sub:pro:${userId}`;
	const cached = await redis.get(cacheKey);

	if (cached !== null) return cached === "pro";

	const plan = await getActiveSubscription.execute(userId);
	await redis.set(cacheKey, plan ?? "free", "EX", SUB_CACHE_TTL);

	return plan === "pro";
}
