import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import type { TeacherStudentDTO } from "../dto/TeacherLessons.dto";

export class GetTeacherStudentsUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(teacherId: string): Promise<TeacherStudentDTO[]> {
		return this.lessonRepo.getTeacherStudents(teacherId);
	}
}
