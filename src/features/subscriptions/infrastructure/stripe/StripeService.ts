import Stripe from "stripe";
import { env } from "../../../../config/env.ts";

export class StripeService {
	private _stripe: Stripe | null = null;

	private get stripe(): Stripe {
		if (!env.STRIPE_SECRET_KEY) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		if (!this._stripe) {
			this._stripe = new Stripe(env.STRIPE_SECRET_KEY);
		}
		return this._stripe;
	}

	async createCheckoutSession(params: {
		userId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
			client_reference_id: params.userId,
			...(params.userEmail ? { customer_email: params.userEmail } : {}),
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			subscription_data: {
				metadata: { userId: params.userId },
			},
		});

		return session.url!;
	}

	async createOrgCheckoutSession(params: {
		orgId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
			...(params.userEmail ? { customer_email: params.userEmail } : {}),
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			metadata: { orgId: params.orgId },
			subscription_data: {
				metadata: { orgId: params.orgId },
			},
		});

		return session.url!;
	}

	constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);
	}
}
