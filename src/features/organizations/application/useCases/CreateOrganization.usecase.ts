import type { IOrganizationRepository } from "../../domain/repositories/IOrganizationRepository.ts";
import type { Organization } from "../../domain/types/Organization.type.ts";

export class CreateOrganizationUseCase {
	constructor(private readonly repo: IOrganizationRepository) {}

	async execute(name: string, ownerId: string): Promise<Organization> {
		const trimmed = name.trim();
		if (!trimmed) throw new Error("Organization name cannot be empty");
		return this.repo.create(trimmed, ownerId);
	}
}
