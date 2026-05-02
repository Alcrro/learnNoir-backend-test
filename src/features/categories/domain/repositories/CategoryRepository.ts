import type { Category } from "../entities/CategoriesEntitity";

export interface CategoriesRepository {
	findById(id: string): Promise<Category | null>;

	findBySubjectId(subjectId: string): Promise<Category[]>;

	create(category: Category): Promise<void>;

	update(category: Category): Promise<void>;

	delete(id: string): Promise<void>;
}
