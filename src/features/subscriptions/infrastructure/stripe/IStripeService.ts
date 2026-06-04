import type Stripe from "stripe";

export interface IStripeService {
	createCheckoutSession(params: {
		userId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string>;

	createCreatorCheckoutSession(params: {
		userId: string;
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

	constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
}
