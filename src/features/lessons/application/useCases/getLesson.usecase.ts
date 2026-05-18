import type { ILessonRepository } from "../../domain/repositories/LessonRepository";
import { mapToDto } from "../dto/LessonDTO.dto";
import type { LessonDTO } from "../dto/LessonType.type";

export class GetLesson {
	constructor(private readonly lessonRepoImpl: ILessonRepository) {}

	async execute(id: string): Promise<LessonDTO> {
		const lesson = await this.lessonRepoImpl.get(id);

		return mapToDto(lesson);
	}
}
