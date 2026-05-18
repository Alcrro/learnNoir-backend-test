import { Lesson } from "../../domain/entities/Lesson";
import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { CreateLessonDTO, LessonDTO } from "../dto/LessonType.type";

export class CreateLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(lesson: CreateLessonDTO, authorId: string): Promise<LessonDTO> {
		const newLesson = new Lesson({
			moduleId: lesson.moduleId,
			gradeLevelId: lesson.gradeLevelId ?? null,
			title: lesson.title,
			slug: this.genSlug(lesson.title),
			description: lesson.description ?? null,
			durationSeconds: lesson.durationSeconds ?? 0,
			position: lesson.position ?? 0,
			isActive: lesson.isActive ?? true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const createdLesson = await this.lessonRepo.create(newLesson, authorId);

		return mapToDto(createdLesson);
	}

	private genSlug(title: string): string {
		return title
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
}
