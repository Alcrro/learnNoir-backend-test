import type { OrganizationSubscription } from "../types/OrganizationSubscription.type.ts";
import type { SubscriptionPlan } from "../types/Subscription.type.ts";

export interface IOrganizationSubscriptionRepository {
	findByOrgId(orgId: string): Promise<OrganizationSubscription | null>;
	upsert(orgId: string, plan: SubscriptionPlan): Promise<OrganizationSubscription>;
	findActiveProOrgForUser(userId: string): Promise<OrganizationSubscription | null>;
}
