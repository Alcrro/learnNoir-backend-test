import { LessonEntity } from "../../domain/entities/Lesson";
import type { Database } from "../../../../database.types";
import type { LessonAuthor, LessonStatus } from "../../domain/types/Lesson.type";

type InsertLesson = Database["public"]["Tables"]["lessons"]["Insert"];
type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

export class LessonMapper {
	constructor() {}

	static toDomain(row: LessonRow, authors: LessonAuthor[] = []): LessonEntity {
		return new LessonEntity({
			id: row.id,
			moduleId: row.module_id,
			gradeLevelId: row.grade_level_id ?? null,
			title: row.title,
			slug: row.slug,
			description: row.description ?? null,
			durationSeconds: row.duration_seconds,
			position: row.position,
			isActive: row.is_active ?? false,
			status: normalizeStatus(row.status),
			authors,
			createdAt: new Date(row.created_at ?? Date.now()),
			updatedAt: new Date(row.updated_at ?? Date.now()),
		});
	}

	static toPersistance(lesson: LessonEntity): InsertLesson {
		return {
			id: lesson.id,
			title: lesson.title,
			description: lesson.description ?? null,
			duration_seconds: lesson.durationSeconds,
			grade_level_id: lesson.gradeLevelId,
			position: lesson.position,
			is_active: lesson.isActive,
			status: lesson.getStatus(),
			module_id: lesson.moduleId,
			slug: lesson.slug,
		};
	}
}

function normalizeStatus(status: string | null): LessonStatus {
	if (status === "reviewed" || status === "published") {
		return status;
	}

	return "draft";
}
