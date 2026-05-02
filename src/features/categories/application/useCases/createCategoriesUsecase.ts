import { CategoryEntity } from "../../domain/entities/CategoriesEntitity";
import type { CategoriesRepository } from "../../domain/repositories/CategoryRepository";
import type { CreateCategoryInput } from "../dto/CategoryDTO";

export class createCategoriesUseCase {
	constructor(private readonly categoryRepository: CategoriesRepository) {}

	async execute(category: CreateCategoryInput): Promise<void> {
		const newCategory = {
			name: category.name,
			subjectId: category.subjectId,
			position: category.position ?? 0,
		};
		const categoryEntity = CategoryEntity.create(newCategory);

		await this.categoryRepository.create(categoryEntity);
	}
}
