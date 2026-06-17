import type { Subscription, SubscriptionPlan, SubscriptionStatus } from "../types/Subscription.type.ts";

export interface ISubscriptionRepository {
	findByUserId(userId: string): Promise<Subscription | null>;
	findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null>;
	upsert(userId: string, plan: SubscriptionPlan): Promise<Subscription>;
	saveStripeIds(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<void>;
	updateByStripeSubscriptionId(stripeSubId: string, updates: { plan?: SubscriptionPlan; status?: SubscriptionStatus }): Promise<void>;
}
