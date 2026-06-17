import type { Database } from "../../../../database.types";
import { ModulesEntity } from "../../domain/entities/ModulesEntity";

type ModulesPersistence = Database["public"]["Tables"]["modules"]["Row"];

export class ModulesMapper {
	static toPersistence(modules: ModulesEntity): ModulesPersistence {
		return {
			id: modules.id,
			name: modules.name,
			slug: modules.slug,
			position: modules.getPosition(),
			category_id: modules.getCategoryId(),
			created_at: modules.created_at,
			updated_at: new Date().toISOString(),
			importance: "normal",
		};
	}

	static toDomain(module: ModulesPersistence): ModulesEntity {
		return new ModulesEntity({
			id: module.id,
			name: module.name,
			slug: module.slug,
			position: module.position ?? 0,
			categoryId: module.category_id ?? "no category",
			created_at: module.created_at ?? new Date().toISOString(),
		});
	}
}
