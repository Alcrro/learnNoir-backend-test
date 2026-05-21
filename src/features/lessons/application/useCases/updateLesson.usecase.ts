import { Lesson } from "../../domain/entities/Lesson";
import type { ILessonRepository, LessonEditChange } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO, UpdateLessonDTO } from "../dto/LessonType.type";
import type { role } from "../../../profiles/application/dto/ProfileDTO.type";
import { ForbiddenError } from "../../../../utils/errors/DatabaseError";

export class UpdateLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(
		id: string,
		lessonPatch: UpdateLessonDTO,
		requesterId: string,
		requesterRole: role,
	): Promise<LessonDTO> {
		const currentLesson = await this.lessonRepo.get(id);

		if (
			requesterRole !== "admin" &&
			!currentLesson.authors.some((a) => a.userId === requesterId)
		) {
			throw new ForbiddenError("You are not an author of this lesson");
		}

		const nextTitle = lessonPatch.title ?? currentLesson.title;
		const nextSlug =
			lessonPatch.slug ??
			(lessonPatch.title ? createLessonSlug(lessonPatch.title) : currentLesson.slug);

		const updatedLesson = new Lesson({
			id: currentLesson.id,
			moduleId: lessonPatch.moduleId ?? currentLesson.moduleId,
			gradeLevelId: lessonPatch.gradeLevelId !== undefined
				? lessonPatch.gradeLevelId
				: currentLesson.gradeLevelId,
			language: lessonPatch.language !== undefined
				? lessonPatch.language
				: currentLesson.language,
			title: nextTitle,
			slug: nextSlug,
			description: lessonPatch.description ?? currentLesson.description ?? null,
			durationSeconds:
				lessonPatch.durationSeconds ?? currentLesson.durationSeconds,
			position: lessonPatch.position ?? currentLesson.position,
			isActive: lessonPatch.isActive ?? currentLesson.isActive,
			status: currentLesson.getStatus(),
			authors: currentLesson.authors,
			createdAt: currentLesson.createdAt,
			updatedAt: new Date(),
		});

		await this.lessonRepo.update(id, updatedLesson);

		const changes: LessonEditChange[] = [];
		if (lessonPatch.title && lessonPatch.title.trim() !== currentLesson.title) {
			changes.push({ field: "title", from: currentLesson.title, to: lessonPatch.title.trim() });
		}
		if (lessonPatch.description !== undefined && lessonPatch.description !== currentLesson.description) {
			changes.push({ field: "description", from: currentLesson.description ?? "", to: lessonPatch.description ?? "" });
		}
		if (lessonPatch.durationSeconds !== undefined && lessonPatch.durationSeconds !== currentLesson.durationSeconds) {
			changes.push({ field: "durationSeconds", from: String(currentLesson.durationSeconds), to: String(lessonPatch.durationSeconds) });
		}
		if (changes.length > 0) {
			await this.lessonRepo.logEdit(id, requesterId, changes);
		}

		return mapToDto(updatedLesson);
	}
}

function createLessonSlug(title: string) {
	return title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
