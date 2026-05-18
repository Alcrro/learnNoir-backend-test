import { ModulesEntity } from "../../domain/entities/ModulesEntity";
import type { ModulesRepository } from "../../domain/repositories/modulesRepository.interfaces";
import { type CreateModuleInputDto } from "../dto/ModulesDto";

export class createModuleUsecase {
	constructor(private readonly modulesRepository: ModulesRepository) {}

	async execute(module: CreateModuleInputDto): Promise<void> {
		const moduleEntity = new ModulesEntity({
			...module,
			id: crypto.randomUUID(),
			created_at: new Date().toISOString(),
		});
		await this.modulesRepository.create(moduleEntity);
	}
}
