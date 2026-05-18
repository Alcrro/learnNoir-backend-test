import type { IOrganizationSubscriptionRepository } from "../../domain/repositories/IOrganizationSubscriptionRepository.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class GetOrgActiveSubscriptionUseCase {
	constructor(private readonly repo: IOrganizationSubscriptionRepository) {}

	async execute(orgId: string): Promise<SubscriptionPlan> {
		const sub = await this.repo.findByOrgId(orgId);

		if (!sub || sub.plan !== "pro") return "free";

		if (sub.expiresAt !== null && new Date(sub.expiresAt) < new Date()) {
			return "free";
		}

		return "pro";
	}
}
