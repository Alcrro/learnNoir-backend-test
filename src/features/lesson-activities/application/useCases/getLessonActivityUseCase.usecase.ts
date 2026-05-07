import { AppError } from "../../../../utils/errors/AppError.ts";
import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";
import type { LessonActivity } from "../../domain/types/LessonActivity.type.ts";

export class GetLessonActivityUseCase {
	constructor(
		private readonly lessonActivityRepository: LessonActivityRepository,
	) {}

	async execute(id: string): Promise<LessonActivity> {
		const activity = await this.lessonActivityRepository.findById(id);
		if (!activity) {
			throw new AppError(`Lesson activity ${id} not found`, 404);
		}
		return activity.toPrimitives();
	}
}
