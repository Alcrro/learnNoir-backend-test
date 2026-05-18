import type { Organization, OrganizationMember, OrgMemberRole } from "../types/Organization.type.ts";

export interface IOrganizationRepository {
	create(name: string, ownerId: string): Promise<Organization>;
	findById(id: string): Promise<Organization | null>;
	findByMemberId(userId: string): Promise<Organization[]>;
	getMember(orgId: string, userId: string): Promise<OrganizationMember | null>;
	listMembers(orgId: string): Promise<OrganizationMember[]>;
	addMember(orgId: string, userId: string, role: OrgMemberRole): Promise<OrganizationMember>;
	removeMember(orgId: string, userId: string): Promise<void>;
}
