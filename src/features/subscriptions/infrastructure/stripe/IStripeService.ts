import type Stripe from "stripe";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export interface IStripeService {
	createCheckoutSession(params: {
		userId: string;
		stripeCustomerId?: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string>;

	createCreatorCheckoutSession(params: {
		userId: string;
		stripeCustomerId?: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string>;

	createOrgCheckoutSession(params: {
		orgId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string>;

	upgradeSubscription(stripeSubscriptionId: string, newPriceId: string): Promise<void>;

	planFromPriceId(priceId: string): SubscriptionPlan | null;

	constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;

	createBillingPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string>;
}
