import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryEntity } from "../../domain/entities/CategoriesEntitity";
import type { CategoriesRepository } from "../../domain/repositories/CategoryRepository";
import type { Database } from "../../../../database.types";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import { CategorieMapper } from "../mapper/CategoriesMapper";

export class CategoriesRepoImpl implements CategoriesRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}
	async findById(id: string): Promise<CategoryEntity | null> {
		const { data, error } = await this.db
			.from("categories")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return null; // not found
			}
			throw new DatabaseError(error.message);
		}

		if (!data) throw new Error("category is not found");

		return CategorieMapper.toDomain(data);
	}
	findBySubjectId(subjectId: string): Promise<CategoryEntity[]> {
		throw new Error("Method not implemented.");
	}
	async create(category: CategoryEntity): Promise<void> {
		const toPersistance = CategorieMapper.toPersistenceInsert(category);

		const { error } = await this.db.from("categories").insert(toPersistance);

		if (error) throw new DatabaseError(error.message);
	}
	update(category: CategoryEntity): Promise<void> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
