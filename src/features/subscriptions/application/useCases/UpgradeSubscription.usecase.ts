import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { IStripeService } from "../../infrastructure/stripe/IStripeService.ts";
import { env } from "../../../../config/env.ts";

type UpgradeResult =
	| { type: "upgraded" }
	| { type: "checkout"; url: string };

export class UpgradeSubscriptionUseCase {
	constructor(
		private readonly repo: ISubscriptionRepository,
		private readonly stripe: IStripeService,
	) {}

	async execute(userId: string, params: { successUrl: string; cancelUrl: string }): Promise<UpgradeResult> {
		const sub = await this.repo.findByUserId(userId);

		if (sub?.stripeSubscriptionId) {
			await this.stripe.upgradeSubscription(sub.stripeSubscriptionId, env.STRIPE_CREATOR_PRICE_ID);
			return { type: "upgraded" };
		}

		const url = await this.stripe.createCreatorCheckoutSession({
			userId,
			...(sub?.stripeCustomerId ? { stripeCustomerId: sub.stripeCustomerId } : {}),
			successUrl: params.successUrl,
			cancelUrl: params.cancelUrl,
		});

		return { type: "checkout", url };
	}
}
