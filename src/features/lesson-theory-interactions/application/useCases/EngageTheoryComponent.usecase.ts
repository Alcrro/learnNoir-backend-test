import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { IUserActivityProgressRepo } from "../../domain/repositories/IUserActivityProgressRepo.ts";
import type { ProgressRepository } from "../../../progress/domain/repositories/ProgressRepository.ts";
import type { LessonProgress } from "../../../progress/domain/types/LessonProgress.type.ts";
import type { TheoryInteractionComponentType } from "../../domain/types/LessonTheoryInteraction.type.ts";

export type EngageComponentResult = {
	lessonProgress: LessonProgress | null;
};

export class EngageTheoryComponentUseCase {
	constructor(
		private readonly interactionRepo: ILessonTheoryInteractionsRepo,
		private readonly activityProgressRepo: IUserActivityProgressRepo,
		private readonly progressRepo: ProgressRepository,
	) {}

	async execute(
		userId: string,
		lessonId: string,
		componentType: TheoryInteractionComponentType,
	): Promise<EngageComponentResult> {
		// Find the latest approved interaction for this component (optional — used to link the activity)
		const approved = await this.interactionRepo.getApprovedByLesson(lessonId);
		const interaction = approved.find((i) => i.componentType === componentType) ?? null;

		const activityId = await this.activityProgressRepo.findOrCreateActivityForComponent(
			lessonId,
			componentType,
			interaction?.id ?? null,
		);

		if (!activityId) {
			// Passive component (concrete_example) — nothing to track
			return { lessonProgress: null };
		}

		await this.activityProgressRepo.upsert(userId, activityId, 1.0, "completed");

		const quizScore = await this.activityProgressRepo.computeWeightedQuizScore(userId, lessonId);
		const lessonProgress = await this.progressRepo.upsert(userId, lessonId, { quizScore });

		return { lessonProgress };
	}
}
