import type { ICreatorSubscriptionRepository } from "../../domain/repositories/ICreatorSubscriptionRepository.ts";

export class UpsertCreatorSubscriptionUseCase {
	constructor(private readonly repo: ICreatorSubscriptionRepository) {}

	async execute(userId: string): Promise<void> {
		await this.repo.upsert(userId);
	}
}
