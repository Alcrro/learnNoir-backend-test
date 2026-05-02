import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubjectsRepository } from "../../domain/repositories/SubjectsRepository.interfaces";
import type { SubjectEntity } from "../../domain/entities/SubjectEntity";
import { SubjectsMapper } from "../mapper/SubjectsMapper.mapper";

export class SubjectsRepoImpl implements SubjectsRepository {
	constructor(private readonly db: SupabaseClient) {}
	async create(data: SubjectEntity): Promise<SubjectEntity> {
		const persistenceData = SubjectsMapper.toPersistence(data);
		const { data: createdSubject, error } = await this.db
			.from("subjects")
			.insert(persistenceData)
			.select("*")
			.single();

		if (error) {
			throw new Error(`Failed to create subject: ${error.message}`);
		}

		return SubjectsMapper.toDomain(createdSubject);
	}
	async update(id: string, data: SubjectEntity): Promise<SubjectEntity> {
		const persistenceData = SubjectsMapper.toPersistence(data);
		const { data: updatedSubject, error } = await this.db
			.from("subjects")
			.update(persistenceData)
			.eq("id", id)
			.select("*")
			.single();

		if (error) {
			throw new Error(`Failed to update subject: ${error.message}`);
		}

		return SubjectsMapper.toDomain(updatedSubject);
	}
	async delete(id: string): Promise<void> {
		const { error } = await this.db.from("subjects").delete().eq("id", id);

		if (error) {
			throw new Error(`Failed to delete subject: ${error.message}`);
		}
	}
	async findById(id: string): Promise<SubjectEntity | null> {
		const { data, error } = await this.db
			.from("subjects")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(`Failed to find subject by ID: ${error.message}`);
		}

		return data ? SubjectsMapper.toDomain(data) : null;
	}
	async findBySlug(slug: string): Promise<SubjectEntity | null> {
		const { data, error } = await this.db
			.from("subjects")
			.select("*")
			.eq("slug", slug)
			.single();

		if (error) {
			throw new Error(`Failed to find subject by slug: ${error.message}`);
		}

		return data ? SubjectsMapper.toDomain(data) : null;
	}
	async findAll(): Promise<SubjectEntity[]> {
		const { data, error } = await this.db.from("subjects").select("*");

		if (error) {
			throw new Error(`Failed to find all subjects: ${error.message}`);
		}

		return data.map(SubjectsMapper.toDomain);
	}
}
