import type { Lesson } from "../../domain/entities/Lesson";
import type { LessonDTO } from "./LessonType.type";

export function mapToDto(lesson: Lesson): LessonDTO {
	return {
		id: lesson.id,
		moduleId: lesson.moduleId,
		title: lesson.title,
		slug: lesson.slug,
		description: lesson.description ?? null,
		durationSeconds: lesson.durationSeconds,
		position: lesson.position,
		isActive: lesson.isActive,
		status: lesson.getStatus(),
		authors: lesson.authors,
		createdAt: lesson.createdAt,
		updatedAt: lesson.updatedAt,
	};
}
