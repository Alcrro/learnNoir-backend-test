import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { OrganizationMember } from "../../domain/types/Organization.type.ts";

export class ListMembersUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(orgId: string, requestingUserId: string): Promise<OrganizationMember[]> {
		const member = await this.repo.getMember(orgId, requestingUserId);
		if (!member) throw new Error("Forbidden");

		return this.repo.listMembers(orgId);
	}
}
