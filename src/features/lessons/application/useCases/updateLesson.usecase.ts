import { Lesson } from "../../domain/entities/Lesson";
import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO, UpdateLessonDTO } from "../dto/LessonType.type";

export class UpdateLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(id: string, lessonPatch: UpdateLessonDTO): Promise<LessonDTO> {
		const currentLesson = await this.lessonRepo.get(id);
		const nextTitle = lessonPatch.title ?? currentLesson.title;
		const nextSlug =
			lessonPatch.slug ??
			(lessonPatch.title ? createLessonSlug(lessonPatch.title) : currentLesson.slug);

		const updatedLesson = new Lesson({
			id: currentLesson.id,
			moduleId: lessonPatch.moduleId ?? currentLesson.moduleId,
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
