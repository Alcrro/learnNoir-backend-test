import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { IOrganizationSubscriptionRepository } from "../../domain/repositories/IOrganizationSubscriptionRepository.ts";

export type ActiveSubscriptionStatus = { pro: boolean; creator: boolean };

export class GetActiveSubscriptionUseCase {
	constructor(
		private readonly repo: ISubscriptionRepository,
		private readonly orgSubRepo: IOrganizationSubscriptionRepository,
	) {}

	async execute(userId: string): Promise<ActiveSubscriptionStatus> {
		const [sub, orgSub] = await Promise.all([
			this.repo.findByUserId(userId),
			this.orgSubRepo.findActiveProOrgForUser(userId),
		]);

		const hasPro =
			(sub !== null && sub.plan === "pro" && sub.status === "active") ||
			orgSub !== null;

		const hasCreator =
			sub !== null && sub.plan === "creator" && sub.status === "active";

		return { pro: hasPro, creator: hasCreator };
	}
}
