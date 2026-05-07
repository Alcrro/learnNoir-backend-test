import { AppError } from "../../../../utils/errors/AppError.ts";
import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";

export class DeleteLessonActivityUseCase {
	constructor(
		private readonly lessonActivityRepository: LessonActivityRepository,
	) {}

	async execute(id: string): Promise<void> {
		const activity = await this.lessonActivityRepository.findById(id);
		if (!activity) {
			throw new AppError(`Lesson activity ${id} not found`, 404);
		}
		await this.lessonActivityRepository.delete(id);
	}
}
