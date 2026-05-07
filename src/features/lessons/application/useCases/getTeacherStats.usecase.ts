import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";
import type { TeacherStatsDTO } from "../dto/TeacherLessons.dto";

export class GetTeacherStatsUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(teacherId: string): Promise<TeacherStatsDTO> {
		return this.lessonRepo.getTeacherStats(teacherId);
	}
}
