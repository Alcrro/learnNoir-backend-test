import { supabase } from "../../../../core/db/supabaseClient.ts";
import { SubscriptionRepoImpl } from "../db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../db/OrganizationSubscriptionRepoImpl.ts";
import { StripeService } from "../stripe/StripeService.ts";
import { GetActiveSubscriptionUseCase } from "../../application/useCases/GetActiveSubscription.usecase.ts";
import { UpsertSubscriptionUseCase } from "../../application/useCases/UpsertSubscription.usecase.ts";
import { UpsertOrgSubscriptionUseCase } from "../../application/useCases/UpsertOrgSubscription.usecase.ts";
import { CreateCheckoutSessionUseCase } from "../../application/useCases/CreateCheckoutSession.usecase.ts";
import { SubscriptionController } from "../../interfaces/controller/Subscription.controller.ts";

export function createSubscriptionController(): SubscriptionController {
	const repo = new SubscriptionRepoImpl(supabase);
	const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
	const stripeService = new StripeService();

	return new SubscriptionController(
		new GetActiveSubscriptionUseCase(repo, orgSubRepo),
		new UpsertSubscriptionUseCase(repo),
		new UpsertOrgSubscriptionUseCase(orgSubRepo),
		new CreateCheckoutSessionUseCase(stripeService),
		stripeService,
	);
}
