import type { StripeService } from "../../infrastructure/stripe/StripeService.ts";

export class CreateOrgCheckoutSessionUseCase {
	constructor(private readonly stripeService: StripeService) {}

	async execute(params: {
		orgId: string;
		userEmail?: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<string> {
		return this.stripeService.createOrgCheckoutSession(params);
	}
}
