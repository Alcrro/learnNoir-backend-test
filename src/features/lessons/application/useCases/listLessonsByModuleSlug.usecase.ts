import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class ListLessonsByModuleSlugUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(slug: string, language?: string | null): Promise<LessonDTO[]> {
		const lessons = await this.lessonRepo.listByModuleSlug(slug, language);

		return lessons.map(mapToDto);
	}
}
