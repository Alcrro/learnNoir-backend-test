import Stripe from "stripe";
import { env } from "../../../../config/env.ts";
import type { IStripeService } from "./IStripeService.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class StripeService implements IStripeService {
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
		stripeCustomerId?: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
			client_reference_id: params.userId,
			...(params.stripeCustomerId
				? { customer: params.stripeCustomerId }
				: params.userEmail
					? { customer_email: params.userEmail }
					: {}),
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			subscription_data: { metadata: { userId: params.userId } },
		});

		return session.url!;
	}

	async createCreatorCheckoutSession(params: {
		userId: string;
		stripeCustomerId?: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: env.STRIPE_CREATOR_PRICE_ID, quantity: 1 }],
			client_reference_id: params.userId,
			...(params.stripeCustomerId
				? { customer: params.stripeCustomerId }
				: params.userEmail
					? { customer_email: params.userEmail }
					: {}),
			success_url: params.successUrl,
			cancel_url: params.cancelUrl,
			metadata: { plan: "creator" },
			subscription_data: { metadata: { userId: params.userId, plan: "creator" } },
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
			subscription_data: { metadata: { orgId: params.orgId } },
		});

		return session.url!;
	}

	async upgradeSubscription(stripeSubscriptionId: string, newPriceId: string): Promise<void> {
		const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
		const item = subscription.items.data[0];
		if (!item) throw new Error("Subscription has no items");

		await this.stripe.subscriptions.update(stripeSubscriptionId, {
			proration_behavior: "create_prorations",
			items: [{ id: item.id, price: newPriceId }],
		});
	}

	planFromPriceId(priceId: string): SubscriptionPlan | null {
		if (priceId === env.STRIPE_PRICE_ID) return "pro";
		if (priceId === env.STRIPE_CREATOR_PRICE_ID) return "creator";
		return null;
	}

	constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);
	}

	async createBillingPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string> {
		const session = await this.stripe.billingPortal.sessions.create({
			customer: stripeCustomerId,
			return_url: returnUrl,
		});
		return session.url;
	}
}
