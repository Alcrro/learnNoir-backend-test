export type SubscriptionPlan = "free" | "pro" | "creator";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export type Subscription = {
	id: string;
	userId: string;
	plan: SubscriptionPlan;
	status: SubscriptionStatus;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	startedAt: string;
	expiresAt: string | null;
	createdAt: string;
};
