import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";

export class RemoveMemberUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(orgId: string, targetUserId: string, requestingUserId: string): Promise<void> {
		const requester = await this.repo.getMember(orgId, requestingUserId);
		if (!requester || (requester.role !== "owner" && requester.role !== "admin")) {
			throw new Error("Forbidden");
		}

		const target = await this.repo.getMember(orgId, targetUserId);
		if (!target) throw new Error("Member not found");

		// Cannot remove the owner
		if (target.role === "owner") throw new Error("Cannot remove the organization owner");

		// Admins cannot remove other admins
		if (requester.role === "admin" && target.role === "admin") {
			throw new Error("Admins cannot remove other admins");
		}

		return this.repo.removeMember(orgId, targetUserId);
	}
}
