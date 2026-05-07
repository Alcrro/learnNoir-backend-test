import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

// Returns the lesson DTO for a given slug, or null if no lesson with that slug exists.
export class GetLessonBySlugUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(slug: string): Promise<LessonDTO | null> {
		const lesson = await this.lessonRepo.getBySlug(slug);

		if (!lesson) return null;

		return mapToDto(lesson);
	}
}
