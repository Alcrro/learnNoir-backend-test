import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class ListLessonsByModuleIdUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(moduleId: string): Promise<LessonDTO[]> {
		const lessons = await this.lessonRepo.listByModuleId(moduleId);

		return lessons.map(mapToDto);
	}
}
