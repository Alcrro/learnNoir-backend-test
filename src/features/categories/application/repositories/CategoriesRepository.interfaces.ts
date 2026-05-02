import type { CategoryQueryDTOOutput } from "../dto/CategoryQueryDTO";

export interface CategoriesQueryRepository {
	getCategoriesStats(): Promise<CategoryQueryDTOOutput>;
}
