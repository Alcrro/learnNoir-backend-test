import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class ListLessonsUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(): Promise<LessonDTO[]> {
		const lessons = await this.lessonRepo.list();

		return lessons.map(mapToDto);
	}
}
