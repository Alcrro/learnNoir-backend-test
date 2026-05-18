export type OrgMemberRole = "owner" | "admin" | "member";

export type Organization = {
	id: string;
	name: string;
	ownerId: string;
	createdAt: string;
};

export type OrganizationMember = {
	id: string;
	orgId: string;
	userId: string;
	role: OrgMemberRole;
	joinedAt: string;
};
