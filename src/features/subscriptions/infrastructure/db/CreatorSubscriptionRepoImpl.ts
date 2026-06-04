import type { SupabaseClient } from "@supabase/supabase-js";
import type { ICreatorSubscriptionRepository } from "../../domain/repositories/ICreatorSubscriptionRepository.ts";

export class CreatorSubscriptionRepoImpl implements ICreatorSubscriptionRepository {
	constructor(private readonly db: SupabaseClient) {}

	async findActiveByUserId(userId: string): Promise<boolean> {
		const { data, error } = await this.db
			.from("creator_subscriptions")
			.select("id, expires_at")
			.eq("user_id", userId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return false;

		const expiresAt = data.expires_at as string | null;
		if (expiresAt !== null && new Date(expiresAt) < new Date()) return false;

		return true;
	}

	async upsert(userId: string): Promise<void> {
		const { error } = await this.db
			.from("creator_subscriptions")
			.upsert(
				{ user_id: userId, started_at: new Date().toISOString() },
				{ onConflict: "user_id" },
			);

		if (error) throw new Error(error.message);
	}
}
