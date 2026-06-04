import type { IStripeService } from "../../infrastructure/stripe/IStripeService.ts";

export class CreateCreatorCheckoutSessionUseCase {
	constructor(private readonly stripeService: IStripeService) {}

	async execute(params: {
		userId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		return this.stripeService.createCreatorCheckoutSession(params);
	}
}
