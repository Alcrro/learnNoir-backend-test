import { supabase } from "../../../../core/db/supabaseClient.ts";
import { SubscriptionRepoImpl } from "../db/SubscriptionRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../db/OrganizationSubscriptionRepoImpl.ts";
import { CreatorSubscriptionRepoImpl } from "../db/CreatorSubscriptionRepoImpl.ts";
import { StripeService } from "../stripe/StripeService.ts";
import { GetActiveSubscriptionUseCase } from "../../application/useCases/GetActiveSubscription.usecase.ts";
import { GetCreatorSubscriptionUseCase } from "../../application/useCases/GetCreatorSubscription.usecase.ts";
import { UpsertSubscriptionUseCase } from "../../application/useCases/UpsertSubscription.usecase.ts";
import { UpsertOrgSubscriptionUseCase } from "../../application/useCases/UpsertOrgSubscription.usecase.ts";
import { UpsertCreatorSubscriptionUseCase } from "../../application/useCases/UpsertCreatorSubscription.usecase.ts";
import { CreateCheckoutSessionUseCase } from "../../application/useCases/CreateCheckoutSession.usecase.ts";
import { CreateCreatorCheckoutSessionUseCase } from "../../application/useCases/CreateCreatorCheckoutSession.usecase.ts";
import { SubscriptionController } from "../../interfaces/controller/Subscription.controller.ts";

export function createSubscriptionController(): SubscriptionController {
	const repo = new SubscriptionRepoImpl(supabase);
	const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
	const creatorRepo = new CreatorSubscriptionRepoImpl(supabase);
	const stripeService = new StripeService();

	return new SubscriptionController(
		new GetActiveSubscriptionUseCase(repo, orgSubRepo),
		new GetCreatorSubscriptionUseCase(creatorRepo),
		new UpsertSubscriptionUseCase(repo),
		new UpsertOrgSubscriptionUseCase(orgSubRepo),
		new UpsertCreatorSubscriptionUseCase(creatorRepo),
		new CreateCheckoutSessionUseCase(stripeService),
		new CreateCreatorCheckoutSessionUseCase(stripeService),
		stripeService,
	);
}
