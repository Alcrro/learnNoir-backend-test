import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { Organization } from "../../domain/types/Organization.type.ts";

export class GetMyOrganizationsUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(userId: string): Promise<Organization[]> {
		return this.repo.findByMemberId(userId);
	}
}
