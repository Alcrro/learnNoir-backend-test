import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type { LessonProgressWithLesson } from "../../domain/types/LessonProgress.type";

// Returns all lesson progress rows for the authenticated user,
// each enriched with lesson title, slug and module name.
export class GetUserProgressUseCase {
	constructor(private readonly progressRepo: ProgressRepository) {}

	async execute(userId: string): Promise<LessonProgressWithLesson[]> {
		return this.progressRepo.getAllByUser(userId);
	}
}
