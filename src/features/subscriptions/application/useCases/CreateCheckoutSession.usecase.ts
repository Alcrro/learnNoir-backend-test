import type { StripeService } from "../../infrastructure/stripe/StripeService.ts";

export class CreateCheckoutSessionUseCase {
	constructor(private readonly stripeService: StripeService) {}

	async execute(params: {
		userId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		return this.stripeService.createCheckoutSession(params);
	}
}
