import type { CategoriesQueryRepository } from "../repositories/CategoriesRepository.interfaces";

export class getAllCategoriesQueryUsecase {
	constructor(
		private readonly categoyQueryRepository: CategoriesQueryRepository,
	) {}

	async execute() {
		const catStats = await this.categoyQueryRepository.getCategoriesStats();

		return catStats;
	}
}
