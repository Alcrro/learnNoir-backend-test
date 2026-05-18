import type { SupabaseClient } from "@supabase/supabase-js";
import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { Organization, OrganizationMember, OrgMemberRole } from "../../domain/types/Organization.type.ts";

export class OrganizationRepoImpl implements IOrganizationRepository {
	constructor(private readonly db: SupabaseClient) {}

	async create(name: string, ownerId: string): Promise<Organization> {
		const { data: org, error: orgError } = await this.db
			.from("organizations")
			.insert({ name, owner_id: ownerId })
			.select("*")
			.single();

		if (orgError) throw new Error(orgError.message);

		// Insert owner as member with role 'owner'
		const { error: memberError } = await this.db
			.from("organization_members")
			.insert({ org_id: org.id, user_id: ownerId, role: "owner" });

		if (memberError) throw new Error(memberError.message);

		return this.toOrganization(org);
	}

	async findById(id: string): Promise<Organization | null> {
		const { data, error } = await this.db
			.from("organizations")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;

		return this.toOrganization(data);
	}

	async findByMemberId(userId: string): Promise<Organization[]> {
		const { data, error } = await this.db
			.from("organization_members")
			.select("org_id, organizations(*)")
			.eq("user_id", userId);

		if (error) throw new Error(error.message);
		if (!data) return [];

		return data
			.map((row) => row.organizations)
			.filter(Boolean)
			.map((org) => this.toOrganization(org as unknown as Record<string, unknown>));
	}

	async getMember(orgId: string, userId: string): Promise<OrganizationMember | null> {
		const { data, error } = await this.db
			.from("organization_members")
			.select("*")
			.eq("org_id", orgId)
			.eq("user_id", userId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;

		return this.toMember(data);
	}

	async listMembers(orgId: string): Promise<OrganizationMember[]> {
		const { data, error } = await this.db
			.from("organization_members")
			.select("*")
			.eq("org_id", orgId)
			.order("joined_at", { ascending: true });

		if (error) throw new Error(error.message);

		return (data ?? []).map((row) => this.toMember(row));
	}

	async addMember(orgId: string, userId: string, role: OrgMemberRole): Promise<OrganizationMember> {
		const { data, error } = await this.db
			.from("organization_members")
			.insert({ org_id: orgId, user_id: userId, role })
			.select("*")
			.single();

		if (error) throw new Error(error.message);

		return this.toMember(data);
	}

	async removeMember(orgId: string, userId: string): Promise<void> {
		const { error } = await this.db
			.from("organization_members")
			.delete()
			.eq("org_id", orgId)
			.eq("user_id", userId);

		if (error) throw new Error(error.message);
	}

	private toOrganization(row: Record<string, unknown>): Organization {
		return {
			id: row["id"] as string,
			name: row["name"] as string,
			ownerId: row["owner_id"] as string,
			createdAt: row["created_at"] as string,
		};
	}

	private toMember(row: Record<string, unknown>): OrganizationMember {
		return {
			id: row["id"] as string,
			orgId: row["org_id"] as string,
			userId: row["user_id"] as string,
			role: row["role"] as OrgMemberRole,
			joinedAt: row["joined_at"] as string,
		};
	}
}
