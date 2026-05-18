import type { ModulesRepository } from "../../domain/repositories/modulesRepository.interfaces";
import type { ModulesEntity } from "../../domain/entities/ModulesEntity";

export class getAllModulesUsecase {
	constructor(private readonly modulesRepository: ModulesRepository) {}

	async execute(): Promise<ModulesEntity[]> {
		return this.modulesRepository.findAll();
	}
}
