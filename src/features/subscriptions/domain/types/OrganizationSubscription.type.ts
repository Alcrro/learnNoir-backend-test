import type { SubscriptionPlan } from "./Subscription.type.ts";

export type OrganizationSubscription = {
	id: string;
	orgId: string;
	plan: SubscriptionPlan;
	startedAt: string;
	expiresAt: string | null;
	createdAt: string;
};
