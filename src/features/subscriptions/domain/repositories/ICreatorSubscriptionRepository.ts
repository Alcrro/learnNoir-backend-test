export interface ICreatorSubscriptionRepository {
	findActiveByUserId(userId: string): Promise<boolean>;
	upsert(userId: string): Promise<void>;
}
