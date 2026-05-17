import type { ILessonQueryRepository } from "../repositories/ILessonQueryRepository.ts";
import type { TeacherLessonDTO } from "../dto/TeacherLessons.dto";

export class ListTeacherLessonsUseCase {
	constructor(private readonly lessonQueryRepo: ILessonQueryRepository) {}

	async execute(teacherId: string): Promise<TeacherLessonDTO[]> {
		return this.lessonQueryRepo.listByTeacher(teacherId);
	}
}
