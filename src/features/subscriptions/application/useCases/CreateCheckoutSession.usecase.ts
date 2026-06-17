import type { IStripeService } from "../../infrastructure/stripe/IStripeService.ts";

export class CreateCheckoutSessionUseCase {
	constructor(private readonly stripeService: IStripeService) {}

	async execute(params: {
		userId: string;
		stripeCustomerId?: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		return this.stripeService.createCheckoutSession(params);
	}
}
