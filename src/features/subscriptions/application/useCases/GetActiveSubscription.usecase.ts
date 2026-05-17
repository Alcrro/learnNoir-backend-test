import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class GetActiveSubscriptionUseCase {
	constructor(private readonly repo: ISubscriptionRepository) {}

	async execute(userId: string): Promise<SubscriptionPlan> {
		const sub = await this.repo.findByUserId(userId);

		if (!sub || sub.plan !== "pro") return "free";

		if (sub.expiresAt !== null && new Date(sub.expiresAt) < new Date()) {
			return "free";
		}

		return "pro";
	}
}
