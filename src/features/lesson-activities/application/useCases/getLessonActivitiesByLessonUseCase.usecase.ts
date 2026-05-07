import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";
import type { LessonActivity } from "../../domain/types/LessonActivity.type.ts";

export class GetLessonActivitiesByLessonUseCase {
	constructor(
		private readonly lessonActivityRepository: LessonActivityRepository,
	) {}

	async execute(lessonId: string): Promise<LessonActivity[]> {
		const activities =
			await this.lessonActivityRepository.findByLessonId(lessonId);
		return activities.map((a) => a.toPrimitives());
	}
}
