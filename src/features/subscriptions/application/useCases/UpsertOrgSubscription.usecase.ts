import type { IOrganizationSubscriptionRepository } from "../../domain/repositories/IOrganizationSubscriptionRepository.ts";
import type { OrganizationSubscription } from "../../domain/types/OrganizationSubscription.type.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class UpsertOrgSubscriptionUseCase {
	constructor(private readonly repo: IOrganizationSubscriptionRepository) {}

	async execute(orgId: string, plan: SubscriptionPlan): Promise<OrganizationSubscription> {
		return this.repo.upsert(orgId, plan);
	}
}
