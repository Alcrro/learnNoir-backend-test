import type { ModulesRepository } from "../../../modules/domain/repositories/modulesRepository.interfaces";
import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class ListLessonsByModuleSlugUseCase {
	constructor(
		private readonly moduleRepo: ModulesRepository,
		private readonly lessonRepo: ILessonRepository,
	) {}

	async execute(slug: string, language?: string | null): Promise<LessonDTO[]> {
		const module = await this.moduleRepo.findBySlug(slug);
		if (!module) return [];

		const lessons = await this.lessonRepo.listByModuleId(module.id, language);
		return lessons.map(mapToDto);
	}
}
