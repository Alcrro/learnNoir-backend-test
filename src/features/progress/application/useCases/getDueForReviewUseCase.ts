import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type { LessonWithReview } from "../../../../../../shared/src/lesson-review.ts";

export class GetDueForReviewUseCase {
	constructor(private readonly progressRepo: ProgressRepository) {}

	async execute(userId: string): Promise<LessonWithReview[]> {
		return this.progressRepo.getDueForReview(userId);
	}
}
