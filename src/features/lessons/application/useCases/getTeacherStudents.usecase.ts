import type { ILessonQueryRepository } from "../repositories/ILessonQueryRepository.ts";
import type { TeacherStudentDTO } from "../dto/TeacherLessons.dto";

export class GetTeacherStudentsUseCase {
	constructor(private readonly lessonQueryRepo: ILessonQueryRepository) {}

	async execute(teacherId: string): Promise<TeacherStudentDTO[]> {
		return this.lessonQueryRepo.getTeacherStudents(teacherId);
	}
}
