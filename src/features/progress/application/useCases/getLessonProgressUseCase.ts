import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type { LessonProgress } from "../../domain/types/LessonProgress.type";

// Returns the authenticated user's progress for a given lesson.
// Returns null when the user has not started the lesson yet.
export class GetLessonProgressUseCase {
	constructor(private readonly progressRepo: ProgressRepository) {}

	async execute(userId: string, lessonId: string): Promise<LessonProgress | null> {
		return this.progressRepo.getByUserAndLesson(userId, lessonId);
	}
}
