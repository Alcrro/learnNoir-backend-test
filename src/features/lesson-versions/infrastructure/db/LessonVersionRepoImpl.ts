import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError, NotFoundError } from "../../../../utils/errors/DatabaseError.ts";
import type { ILessonVersionRepository } from "../../domain/repositories/ILessonVersionRepository.ts";
import type { LessonVersion, CreateLessonVersionDTO } from "../../domain/types/LessonVersion.type.ts";
import type { Database } from "../../../../database.types.ts";

type VersionRow = Database["public"]["Tables"]["lesson_versions"]["Row"];

function toEntity(row: VersionRow): LessonVersion {
	return {
		id: row.id,
		lessonId: row.lesson_id,
		title: row.title,
		version: row.version ?? 1,
		description: row.description ?? null,
		difficultyLevel: row.difficulty_level ?? null,
		estimatedDurationMinutes: row.estimated_duration_minutes ?? null,
		gradeLevelId: row.grade_level_id ?? null,
		conceptId: row.concept_id ?? null,
		pedagogyStyle: row.pedagogy_style ?? null,
		isPublished: row.is_published ?? false,
		createdAt: row.created_at ?? new Date().toISOString(),
		updatedAt: row.updated_at ?? new Date().toISOString(),
	};
}

export class LessonVersionRepoImpl implements ILessonVersionRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async findById(id: string): Promise<LessonVersion | null> {
		const { data, error } = await this.db
			.from("lesson_versions")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);
		return data ? toEntity(data) : null;
	}

	async findByLessonId(lessonId: string): Promise<LessonVersion[]> {
		const { data, error } = await this.db
			.from("lesson_versions")
			.select("*")
			.eq("lesson_id", lessonId)
			.order("version", { ascending: false });

		if (error) throw new DatabaseError(error.message);
		return (data ?? []).map(toEntity);
	}

	async create(lessonId: string, dto: CreateLessonVersionDTO): Promise<LessonVersion> {
		const existing = await this.findByLessonId(lessonId);
		const nextVersion = existing.length > 0
			? Math.max(...existing.map((v) => v.version)) + 1
			: 1;

		const { data, error } = await this.db
			.from("lesson_versions")
			.insert({
				lesson_id: lessonId,
				title: dto.title,
				version: nextVersion,
				description: dto.description ?? null,
				difficulty_level: dto.difficultyLevel ?? null,
				estimated_duration_minutes: dto.estimatedDurationMinutes ?? null,
				grade_level_id: dto.gradeLevelId ?? null,
				concept_id: dto.conceptId ?? null,
				pedagogy_style: dto.pedagogyStyle ?? null,
				is_published: false,
			})
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);
		return toEntity(data);
	}

	async publish(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lesson_versions")
			.update({ is_published: true, updated_at: new Date().toISOString() }, { count: "exact" })
			.eq("id", id);

		if (error) throw new DatabaseError(error.message);
		if (!count) throw new NotFoundError("Lesson version not found");
	}

	async unpublish(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lesson_versions")
			.update({ is_published: false, updated_at: new Date().toISOString() }, { count: "exact" })
			.eq("id", id);

		if (error) throw new DatabaseError(error.message);
		if (!count) throw new NotFoundError("Lesson version not found");
	}
}
