import type { CategoriesQueryRepository } from "../repositories/CategoriesRepository.interfaces";

export class GetCategoriesWithModulesUseCase {
	constructor(private readonly repo: CategoriesQueryRepository) {}

	async execute(subjectSlug: string) {
		return this.repo.getCategoriesWithModules(subjectSlug);
	}
}
