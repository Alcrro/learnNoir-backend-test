import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { OrganizationMember, OrgMemberRole } from "../../domain/types/Organization.type.ts";

export class AddMemberUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(orgId: string, targetUserId: string, role: OrgMemberRole, requestingUserId: string): Promise<OrganizationMember> {
		const requester = await this.repo.getMember(orgId, requestingUserId);
		if (!requester || (requester.role !== "owner" && requester.role !== "admin")) {
			throw new Error("Forbidden");
		}

		// Only owner can add admins
		if (role === "admin" && requester.role !== "owner") {
			throw new Error("Only the owner can assign admin role");
		}

		// Cannot add another owner
		if (role === "owner") throw new Error("Cannot assign owner role");

		const existing = await this.repo.getMember(orgId, targetUserId);
		if (existing) throw new Error("User is already a member");

		return this.repo.addMember(orgId, targetUserId, role);
	}
}
