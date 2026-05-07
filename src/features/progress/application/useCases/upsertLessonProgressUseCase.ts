import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type { LessonProgress, UpsertProgressInput } from "../../domain/types/LessonProgress.type";

// Creates or updates the user's progress record for a lesson.
// The repository computes the new weightedScore from the component scores.
export class UpsertLessonProgressUseCase {
	constructor(private readonly progressRepo: ProgressRepository) {}

	async execute(
		userId: string,
		lessonId: string,
		input: UpsertProgressInput,
	): Promise<LessonProgress> {
		return this.progressRepo.upsert(userId, lessonId, input);
	}
}
