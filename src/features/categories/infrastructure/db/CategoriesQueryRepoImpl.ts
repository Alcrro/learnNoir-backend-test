import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoriesQueryRepository } from "../../application/repositories/CategoriesRepository.interfaces";
import type { Database } from "../../../../database.types";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import { SubjectQueryMapper } from "../mapper/SubjectQueryMapper.mapper";
import type { CategoryQueryDTOOutput } from "../../application/dto/CategoryQueryDTO";

export class CategoriesQueryRepoImpl implements CategoriesQueryRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async getCategoriesStats(): Promise<CategoryQueryDTOOutput> {
		const { data, error } = await this.db.rpc("get_subject_cards");

		if (error) throw new DatabaseError(error.message);

		return data.map(SubjectQueryMapper.toDomain);
	}
}
