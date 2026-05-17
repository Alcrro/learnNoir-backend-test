export type SubscriptionPlan = "free" | "pro";

export type Subscription = {
	id: string;
	userId: string;
	plan: SubscriptionPlan;
	startedAt: string;
	expiresAt: string | null;
	createdAt: string;
};
