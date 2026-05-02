import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class ListLessonsByModuleSlugUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(slug: string): Promise<LessonDTO[]> {
		const lessons = await this.lessonRepo.listByModuleSlug(slug);

		return lessons.map(mapToDto);
	}
}
