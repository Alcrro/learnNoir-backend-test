import { BadRequestError } from "../../../../utils/errors/DatabaseError.ts";
import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";

export class ReorderLessonActivityUseCase {
	constructor(
		private readonly lessonActivityRepository: LessonActivityRepository,
	) {}

	async execute(
		lessonId: string,
		activityId: string,
		newPosition: number,
	): Promise<void> {
		if (!Number.isInteger(newPosition) || newPosition < 0) {
			throw new BadRequestError("Position must be a non-negative integer");
		}
		await this.lessonActivityRepository.reorder(
			lessonId,
			activityId,
			newPosition,
		);
	}
}
