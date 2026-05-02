import type { Database } from "../../../../database.types";
import { CategoryEntity } from "../../domain/entities/CategoriesEntitity";

type CategoryMapperDbSelect = Database["public"]["Tables"]["categories"]["Row"];
type CategoryMapperDbInsert =
	Database["public"]["Tables"]["categories"]["Insert"];
type CategoryMapperDbUpdate =
	Database["public"]["Tables"]["categories"]["Update"];

export class CategorieMapper {
	static toPersistenceInsert(category: CategoryEntity): CategoryMapperDbInsert {
		return {
			name: category.name,
			slug: category.slug,
			subject_id: category.subjectId,
			position: category.position,
		};
	}
	static toPersistenceUpdate(category: CategoryEntity): CategoryMapperDbUpdate {
		return {
			name: category.name,
			slug: category.slug,
			position: category.position,
			updated_at: category.updatedAt.toLocaleDateString(),
		};
	}

	static toDomain(row: CategoryMapperDbSelect): CategoryEntity {
		return CategoryEntity.create({
			name: row.name,
			subjectId: row.subject_id,
			position: row.position ?? 0,
		});
	}
}
