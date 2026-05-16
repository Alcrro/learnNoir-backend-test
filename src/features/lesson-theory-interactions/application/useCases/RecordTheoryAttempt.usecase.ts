import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { ITheoryInteractionAttemptRepo } from "../../domain/repositories/ITheoryInteractionAttemptRepo.ts";
import type { IUserActivityProgressRepo } from "../../domain/repositories/IUserActivityProgressRepo.ts";
import type { ProgressRepository } from "../../../progress/domain/repositories/ProgressRepository.ts";
import type { TheoryInteractionAttempt } from "../../domain/types/TheoryInteractionAttempt.type.ts";
import type { LessonProgress } from "../../../progress/domain/types/LessonProgress.type.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export type RecordAttemptInput = {
	interactionId: string;
	/** null for non-evaluated types (predict_prompt, elaboration) — any answer = full score */
	isCorrect: boolean | null;
	chosenAnswer: unknown;
	correctAnswer: unknown | null;
};

export type RecordAttemptResult = {
	attempt: TheoryInteractionAttempt;
	/** Updated lesson progress. null if no activity was linked to this interaction. */
	lessonProgress: LessonProgress | null;
};

export class RecordTheoryAttemptUseCase {
	constructor(
		private readonly interactionRepo: ILessonTheoryInteractionsRepo,
		private readonly attemptRepo: ITheoryInteractionAttemptRepo,
		private readonly activityProgressRepo: IUserActivityProgressRepo,
		private readonly progressRepo: ProgressRepository,
	) {}

	async execute(userId: string, input: RecordAttemptInput): Promise<RecordAttemptResult> {
		const interaction = await this.interactionRepo.findById(input.interactionId);
		if (!interaction) throw new NotFoundError("Theory interaction not found");

		const attemptNumber = await this.attemptRepo.getNextAttemptNumber(userId, input.interactionId);

		const attempt = await this.attemptRepo.insert({
			userId,
			interactionId: input.interactionId,
			isCorrect: input.isCorrect,
			chosenAnswer: input.chosenAnswer,
			correctAnswer: input.correctAnswer,
			attemptNumber,
		});

		const activityId = await this.activityProgressRepo.findActivityIdByInteraction(input.interactionId);

		if (!activityId) {
			return { attempt, lessonProgress: null };
		}

		// Non-evaluated types (predict_prompt, elaboration): score = 1.0 for any engagement
		const score = input.isCorrect === null ? 1.0 : input.isCorrect ? 1.0 : 0.0;
		const status = score > 0 ? "completed" : "in_progress";

		await this.activityProgressRepo.upsert(userId, activityId, score, status);

		const quizScore = await this.activityProgressRepo.computeWeightedQuizScore(userId, interaction.lessonId);

		const lessonProgress = await this.progressRepo.upsert(userId, interaction.lessonId, {
			quizScore,
		});

		return { attempt, lessonProgress };
	}
}
