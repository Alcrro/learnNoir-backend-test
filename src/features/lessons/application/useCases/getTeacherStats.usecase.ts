import type { ILessonQueryRepository } from "../repositories/ILessonQueryRepository.ts";
import type { TeacherStatsDTO } from "../dto/TeacherLessons.dto";

export class GetTeacherStatsUseCase {
	constructor(private readonly lessonQueryRepo: ILessonQueryRepository) {}

	async execute(teacherId: string): Promise<TeacherStatsDTO> {
		return this.lessonQueryRepo.getTeacherStats(teacherId);
	}
}
