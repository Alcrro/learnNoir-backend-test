import type { ModulesRepository } from "../../domain/repositories/modulesRepository.interfaces";
import type { CreateModuleInputDto } from "../dto/ModulesDto";

export class getAllModulesUsecase {
	constructor(private readonly modulesRepository: ModulesRepository) {}

	async execute(): Promise<CreateModuleInputDto[]> {
		const result = await this.modulesRepository.findAll();

		return result;
	}
}
