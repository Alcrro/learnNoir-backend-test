import type { SupabaseClient } from "@supabase/supabase-js";
import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { Subscription, SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class SubscriptionRepoImpl implements ISubscriptionRepository {
	constructor(private readonly db: SupabaseClient) {}

	async findByUserId(userId: string): Promise<Subscription | null> {
		const { data, error } = await this.db
			.from("subscriptions")
			.select("*")
			.eq("user_id", userId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;

		return this.toSubscription(data);
	}

	async upsert(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
		const { data, error } = await this.db
			.from("subscriptions")
			.upsert(
				{ user_id: userId, plan, started_at: new Date().toISOString() },
				{ onConflict: "user_id" },
			)
			.select("*")
			.single();

		if (error) throw new Error(error.message);

		return this.toSubscription(data);
	}

	private toSubscription(row: Record<string, unknown>): Subscription {
		return {
			id: row["id"] as string,
			userId: row["user_id"] as string,
			plan: row["plan"] as SubscriptionPlan,
			startedAt: row["started_at"] as string,
			expiresAt: (row["expires_at"] as string | null) ?? null,
			createdAt: row["created_at"] as string,
		};
	}
}
