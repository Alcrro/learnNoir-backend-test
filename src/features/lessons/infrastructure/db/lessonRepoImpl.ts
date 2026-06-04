import type { SupabaseClient } from "@supabase/supabase-js";
import type { LessonEntity } from "../../domain/entities/Lesson";
import type { ILessonRepository, LessonEditChange } from "../../domain/repositories/LessonRepository";
import { LessonMapper } from "../mapper/lesson.mapper";
import {
	DatabaseError,
	NotFoundError,
} from "../../../../utils/errors/DatabaseError";
import type { Database } from "../../../../database.types";
import type { LessonAuthor, ProgrammingLanguage } from "../../domain/types/Lesson.type";

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type LessonAuthorRow = Database["public"]["Tables"]["lesson_authors"]["Row"];

export class LessonRepositoryImpl implements ILessonRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async list(): Promise<LessonEntity[]> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.order("position", { ascending: true });

		if (error) {
			throw new DatabaseError(error.message);
		}

		return this.mapRowsWithAuthors(data ?? []);
	}

	async listByModuleId(moduleId: string, language?: string | null): Promise<LessonEntity[]> {
		let query = this.db
			.from("lessons")
			.select("*")
			.eq("module_id", moduleId);

		if (language) {
			query = query.eq("language", language as ProgrammingLanguage);
		}

		const { data, error } = await query.order("position", { ascending: true });

		if (error) {
			throw new DatabaseError(error.message);
		}

		return this.mapRowsWithAuthors(data ?? []);
	}

	async getBySlug(slug: string): Promise<LessonEntity | null> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.eq("slug", slug)
			.maybeSingle();

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!data) return null;

		const authorsByLessonId = await this.getAuthorsByLessonIds([data.id]);
		return LessonMapper.toDomain(data, authorsByLessonId.get(data.id) ?? []);
	}

	async get(id: string): Promise<LessonEntity> {
		const { data, error } = await this.db
			.from("lessons")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!data) {
			throw new NotFoundError("Lesson not found");
		}

		const authorsByLessonId = await this.getAuthorsByLessonIds([data.id]);

		return LessonMapper.toDomain(data, authorsByLessonId.get(data.id) ?? []);
	}

	async create(lesson: LessonEntity, authorId: string): Promise<LessonEntity> {
		const payload = LessonMapper.toPersistance(lesson);
		const { data, error } = await this.db
			.from("lessons")
			.insert(payload)
			.select()
			.single();

		if (error) throw new DatabaseError(error.message);
		if (!data) throw new DatabaseError("Lesson not found");

		const { error: authorError } = await this.db.from("lesson_authors").insert({
			lesson_id: data.id,
			user_id: authorId,
			role: "author",
		});

		if (authorError) {
			await this.db.from("lessons").delete().eq("id", data.id);
			throw new DatabaseError(authorError.message);
		}

		return this.get(data.id);
	}

	async update(id: string, lesson: LessonEntity): Promise<void> {
		const payload = LessonMapper.toPersistance(lesson);
		const { error, count } = await this.db
			.from("lessons")
			.update({
				...payload,
				updated_at: new Date().toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async delete(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lessons")
			.delete({ count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async review(id: string): Promise<void> {
		const { error, count } = await this.db
			.from("lessons")
			.update({
				status: "reviewed",
				updated_at: new Date().toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async publish(id: string): Promise<void> {
		const lesson = await this.get(id);
		lesson.publish();

		const { error, count } = await this.db
			.from("lessons")
			.update({
				status: lesson.getStatus(),
				updated_at: lesson.updatedAt.toISOString(),
			}, { count: "exact" })
			.eq("id", id);

		if (error) {
			throw new DatabaseError(error.message);
		}

		if (!count) {
			throw new NotFoundError("Lesson not found");
		}
	}

	async logEdit(lessonId: string, editorId: string, changes: LessonEditChange[]): Promise<void> {
		const { error } = await this.db.from("lesson_edit_history").insert({
			lesson_id: lessonId,
			editor_id: editorId,
			changes: JSON.parse(JSON.stringify(changes)) as import("../../../../database.types").Json,
		});
		if (error) throw new DatabaseError(error.message);
	}

	private async mapRowsWithAuthors(rows: LessonRow[]): Promise<LessonEntity[]> {
		const authorsByLessonId = await this.getAuthorsByLessonIds(
			rows.map((row) => row.id),
		);

		return rows.map((row) =>
			LessonMapper.toDomain(row, authorsByLessonId.get(row.id) ?? []),
		);
	}

	private async getAuthorsByLessonIds(lessonIds: string[]) {
		const authorsByLessonId = new Map<string, LessonAuthor[]>();

		if (lessonIds.length === 0) {
			return authorsByLessonId;
		}

		const { data, error } = await this.db
			.from("lesson_authors")
			.select("lesson_id, user_id, role")
			.in("lesson_id", lessonIds);

		if (error) {
			throw new DatabaseError(error.message);
		}

		for (const row of (data ?? []) as Pick<
			LessonAuthorRow,
			"lesson_id" | "user_id" | "role"
		>[]) {
			const currentAuthors = authorsByLessonId.get(row.lesson_id) ?? [];

			currentAuthors.push({
				userId: row.user_id,
				role: row.role,
			});
			authorsByLessonId.set(row.lesson_id, currentAuthors);
		}

		return authorsByLessonId;
	}
}
