import type { SupabaseClient } from "@supabase/supabase-js";
import type { IOrganizationSubscriptionRepository } from "../../domain/repositories/IOrganizationSubscriptionRepository.ts";
import type { OrganizationSubscription } from "../../domain/types/OrganizationSubscription.type.ts";
import type { SubscriptionPlan } from "../../domain/types/Subscription.type.ts";

export class OrganizationSubscriptionRepoImpl implements IOrganizationSubscriptionRepository {
	constructor(private readonly db: SupabaseClient) {}

	async findByOrgId(orgId: string): Promise<OrganizationSubscription | null> {
		const { data, error } = await this.db
			.from("organization_subscriptions")
			.select("*")
			.eq("org_id", orgId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;

		return this.toOrgSubscription(data);
	}

	async upsert(orgId: string, plan: SubscriptionPlan): Promise<OrganizationSubscription> {
		const { data, error } = await this.db
			.from("organization_subscriptions")
			.upsert(
				{ org_id: orgId, plan, started_at: new Date().toISOString() },
				{ onConflict: "org_id" },
			)
			.select("*")
			.single();

		if (error) throw new Error(error.message);

		return this.toOrgSubscription(data);
	}

	async findActiveProOrgForUser(userId: string): Promise<OrganizationSubscription | null> {
		const { data: memberships, error: memberError } = await this.db
			.from("organization_members")
			.select("org_id")
			.eq("user_id", userId);

		if (memberError) throw new Error(memberError.message);
		if (!memberships || memberships.length === 0) return null;

		const orgIds = memberships.map((m) => m.org_id as string);

		const { data, error } = await this.db
			.from("organization_subscriptions")
			.select("*")
			.in("org_id", orgIds)
			.eq("plan", "pro")
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;

		// Filter out expired subscriptions in application code since PostgREST
		// doesn't support `expires_at IS NULL OR expires_at > now()` cleanly
		const sub = this.toOrgSubscription(data);
		if (sub.expiresAt !== null && new Date(sub.expiresAt) < new Date()) return null;

		return sub;
	}

	private toOrgSubscription(row: Record<string, unknown>): OrganizationSubscription {
		return {
			id: row["id"] as string,
			orgId: row["org_id"] as string,
			plan: row["plan"] as SubscriptionPlan,
			startedAt: row["started_at"] as string,
			expiresAt: (row["expires_at"] as string | null) ?? null,
			createdAt: row["created_at"] as string,
		};
	}
}
