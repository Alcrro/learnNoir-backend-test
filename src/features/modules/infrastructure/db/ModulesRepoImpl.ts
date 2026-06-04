import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModulesEntity } from "../../domain/entities/ModulesEntity";
import type { ModulesRepository } from "../../domain/repositories/modulesRepository.interfaces";
import { ModulesMapper } from "../mapper/modulesMapper.mapper";
import type { Database } from "../../../../database.types";

export class ModulesRepoImpl implements ModulesRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}
	async create(module: ModulesEntity): Promise<ModulesEntity> {
		const createdModule = ModulesMapper.toPersistence(module);

		const { data, error } = await this.db
			.from("modules")
			.insert(createdModule)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return ModulesMapper.toDomain(data);
	}
	async findById(id: string): Promise<ModulesEntity> {
		const { data, error } = await this.db
			.from("modules")
			.select()
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return ModulesMapper.toDomain(data);
	}

	async findBySlug(slug: string): Promise<ModulesEntity | null> {
		const { data, error } = await this.db
			.from("modules")
			.select()
			.eq("slug", slug)
			.maybeSingle();

		if (error) {
			throw new Error(error.message);
		}

		return data ? ModulesMapper.toDomain(data) : null;
	}
	async findAll(): Promise<ModulesEntity[]> {
		const { data, error } = await this.db.from("modules").select("*");

		if (error) {
			throw new Error(error.message);
		}

		return data.map(ModulesMapper.toDomain);
	}
	update(_id: string, _module: ModulesEntity): Promise<ModulesEntity> {
		throw new Error("Method not implemented.");
	}
	delete(_id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
