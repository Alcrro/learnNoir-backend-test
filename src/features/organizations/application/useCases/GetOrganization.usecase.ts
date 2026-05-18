import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { Organization } from "../../domain/types/Organization.type.ts";

export class GetOrganizationUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(orgId: string, requestingUserId: string): Promise<Organization> {
		const org = await this.repo.findById(orgId);
		if (!org) throw new Error("Organization not found");

		const member = await this.repo.getMember(orgId, requestingUserId);
		if (!member) throw new Error("Forbidden");

		return org;
	}
}
