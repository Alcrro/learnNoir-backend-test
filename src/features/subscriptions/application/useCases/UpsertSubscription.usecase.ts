import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { Subscription, SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class UpsertSubscriptionUseCase {
	constructor(private readonly repo: ISubscriptionRepository) {}

	async execute(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
		return this.repo.upsert(userId, plan);
	}
}
