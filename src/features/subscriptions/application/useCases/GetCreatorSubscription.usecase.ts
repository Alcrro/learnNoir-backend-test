import type { ICreatorSubscriptionRepository } from "../../domain/repositories/ICreatorSubscriptionRepository.ts";

export class GetCreatorSubscriptionUseCase {
	constructor(private readonly repo: ICreatorSubscriptionRepository) {}

	async execute(userId: string): Promise<boolean> {
		return this.repo.findActiveByUserId(userId);
	}
}
