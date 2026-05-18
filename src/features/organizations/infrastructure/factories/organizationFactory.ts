import { supabase } from "../../../../core/db/supabaseClient.ts";
import { OrganizationRepoImpl } from "../db/OrganizationRepoImpl.ts";
import { OrganizationSubscriptionRepoImpl } from "../../../subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl.ts";
import { StripeService } from "../../../subscriptions/infrastructure/stripe/StripeService.ts";
import { CreateOrganizationUseCase } from "../../application/useCases/CreateOrganization.usecase.ts";
import { GetMyOrganizationsUseCase } from "../../application/useCases/GetMyOrganizations.usecase.ts";
import { GetOrganizationUseCase } from "../../application/useCases/GetOrganization.usecase.ts";
import { ListMembersUseCase } from "../../application/useCases/ListMembers.usecase.ts";
import { AddMemberUseCase } from "../../application/useCases/AddMember.usecase.ts";
import { RemoveMemberUseCase } from "../../application/useCases/RemoveMember.usecase.ts";
import { GetOrgActiveSubscriptionUseCase } from "../../../subscriptions/application/useCases/GetOrgActiveSubscription.usecase.ts";
import { CreateOrgCheckoutSessionUseCase } from "../../../subscriptions/application/useCases/CreateOrgCheckoutSession.usecase.ts";
import { OrganizationController } from "../../interfaces/controller/Organization.controller.ts";

export function createOrganizationController(): OrganizationController {
	const orgRepo = new OrganizationRepoImpl(supabase);
	const orgSubRepo = new OrganizationSubscriptionRepoImpl(supabase);
	const stripeService = new StripeService();

	return new OrganizationController(
		new CreateOrganizationUseCase(orgRepo),
		new GetMyOrganizationsUseCase(orgRepo),
		new GetOrganizationUseCase(orgRepo),
		new ListMembersUseCase(orgRepo),
		new AddMemberUseCase(orgRepo),
		new RemoveMemberUseCase(orgRepo),
		new GetOrgActiveSubscriptionUseCase(orgSubRepo),
		new CreateOrgCheckoutSessionUseCase(stripeService),
	);
}
