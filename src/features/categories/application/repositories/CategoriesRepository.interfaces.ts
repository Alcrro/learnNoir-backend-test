import type { CategoryQueryDTOOutput } from "../dto/CategoryQueryDTO";
import type { CategoryWithModulesDTOOutput } from "../dto/CategoryWithModulesDTO";

export interface CategoriesQueryRepository {
	getCategoriesStats(): Promise<CategoryQueryDTOOutput>;
	getCategoriesWithModules(subjectSlug: string): Promise<CategoryWithModulesDTOOutput>;
}
