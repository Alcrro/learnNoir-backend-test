import type { Subscription, SubscriptionPlan } from "../types/Subscription.type.ts";

export interface ISubscriptionRepository {
	findByUserId(userId: string): Promise<Subscription | null>;
	upsert(userId: string, plan: SubscriptionPlan): Promise<Subscription>;
}
