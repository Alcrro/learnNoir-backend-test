import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { IOrganizationSubscriptionRepository } from "../../domain/repositories/IOrganizationSubscriptionRepository.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class GetActiveSubscriptionUseCase {
	constructor(
		private readonly repo: ISubscriptionRepository,
		private readonly orgSubRepo: IOrganizationSubscriptionRepository,
	) {}

	async execute(userId: string): Promise<SubscriptionPlan> {
		const sub = await this.repo.findByUserId(userId);

		if (sub?.plan === "pro" && (sub.expiresAt === null || new Date(sub.expiresAt) >= new Date())) {
			return "pro";
		}

		const orgSub = await this.orgSubRepo.findActiveProOrgForUser(userId);
		if (orgSub) return "pro";

		return "free";
	}
}
