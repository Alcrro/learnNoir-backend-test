import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import type { TeacherLessonDTO } from "../dto/TeacherLessons.dto";

export class ListTeacherLessonsUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(teacherId: string): Promise<TeacherLessonDTO[]> {
		return this.lessonRepo.listByTeacher(teacherId);
	}
}
