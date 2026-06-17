import type { SupabaseClient } from "@supabase/supabase-js";
import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { Subscription, SubscriptionPlan, SubscriptionStatus } from "../../domain/types/Subscription.type.ts";

export class SubscriptionRepoImpl implements ISubscriptionRepository {
	constructor(private readonly db: SupabaseClient) {}

	async findByUserId(userId: string): Promise<Subscription | null> {
		const { data, error } = await this.db
			.from("subscriptions")
			.select("*")
			.eq("user_id", userId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		return data ? this.toSubscription(data) : null;
	}

	async findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null> {
		const { data, error } = await this.db
			.from("subscriptions")
			.select("*")
			.eq("stripe_subscription_id", stripeSubId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		return data ? this.toSubscription(data) : null;
	}

	async upsert(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
		const { data, error } = await this.db
			.from("subscriptions")
			.upsert(
				{ user_id: userId, plan, started_at: new Date().toISOString(), status: "active" },
				{ onConflict: "user_id" },
			)
			.select("*")
			.single();

		if (error) throw new Error(error.message);
		return this.toSubscription(data);
	}

	async saveStripeIds(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<void> {
		const { error } = await this.db
			.from("subscriptions")
			.update({ stripe_customer_id: stripeCustomerId, stripe_subscription_id: stripeSubscriptionId })
			.eq("user_id", userId);

		if (error) throw new Error(error.message);
	}

	async updateByStripeSubscriptionId(
		stripeSubId: string,
		updates: { plan?: SubscriptionPlan; status?: SubscriptionStatus },
	): Promise<void> {
		const payload: Record<string, unknown> = {};
		if (updates.plan !== undefined) payload["plan"] = updates.plan;
		if (updates.status !== undefined) payload["status"] = updates.status;

		const { error } = await this.db
			.from("subscriptions")
			.update(payload)
			.eq("stripe_subscription_id", stripeSubId);

		if (error) throw new Error(error.message);
	}

	private toSubscription(row: Record<string, unknown>): Subscription {
		return {
			id: row["id"] as string,
			userId: row["user_id"] as string,
			plan: row["plan"] as SubscriptionPlan,
			status: (row["status"] as SubscriptionStatus) ?? "active",
			stripeCustomerId: (row["stripe_customer_id"] as string | null) ?? null,
			stripeSubscriptionId: (row["stripe_subscription_id"] as string | null) ?? null,
			startedAt: row["started_at"] as string,
			expiresAt: (row["expires_at"] as string | null) ?? null,
			createdAt: row["created_at"] as string,
		};
	}
}
