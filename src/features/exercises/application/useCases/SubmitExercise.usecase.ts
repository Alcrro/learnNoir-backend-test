import type { IExerciseRepo } from "../../domain/repositories/IExerciseRepo.ts";
import type { IExerciseAttemptRepo } from "../../domain/repositories/IExerciseAttemptRepo.ts";
import type { ProgressRepository } from "../../../progress/domain/repositories/ProgressRepository.ts";
import type { ExerciseAttempt, CodeRunResult } from "../../domain/types/Exercise.type.ts";
import { runCode } from "../../infrastructure/sandbox/NodeSandbox.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export type SubmitExerciseResult = {
	attempt: ExerciseAttempt;
	runResult: CodeRunResult;
};

export class SubmitExerciseUseCase {
	constructor(
		private readonly exerciseRepo: IExerciseRepo,
		private readonly attemptRepo: IExerciseAttemptRepo,
		private readonly progressRepo: ProgressRepository,
	) {}

	async execute(
		userId: string,
		exerciseId: string,
		userCode: string,
		hintsUsed: number,
	): Promise<SubmitExerciseResult> {
		const exercise = await this.exerciseRepo.findById(exerciseId);
		if (!exercise) throw new NotFoundError("Exercise not found");

		// Run against ALL test cases (including hidden) for submission
		const runResult = runCode(userCode, exercise.testCases);

		const passedTests = runResult.results.filter((r) => r.passed).length;
		const totalTests = exercise.testCases.length;

		// Score formula: pass percentage * hint penalty
		const hintPenalty = [1.0, 0.8, 0.6, 0.4][Math.min(hintsUsed, 3)] as number;
		const passPct = totalTests > 0 ? passedTests / totalTests : 0;
		const score = passPct * hintPenalty;

		const hasError = runResult.results.some((r) => r.error !== undefined);
		const status: "passed" | "failed" | "error" =
			hasError && passedTests === 0
				? "error"
				: passedTests === totalTests
					? "passed"
					: "failed";

		const attempt = await this.attemptRepo.insert({
			userId,
			exerciseId,
			code: userCode,
			status,
			passedTests,
			totalTests,
			hintsUsed,
			score,
			executionTimeMs: runResult.totalTimeMs,
		});

		// Update lesson output_score = average best score across all exercises in this lesson
		const bestResults = await this.attemptRepo.findBestByUserAndLesson(userId, exercise.lessonId);
		const allExercises = await this.exerciseRepo.findByLesson(exercise.lessonId);

		if (allExercises.length > 0) {
			// Only count exercises that have at least one attempt
			const attemptedScores = bestResults.map((r) => r.score);
			if (attemptedScores.length > 0) {
				const avgScore = attemptedScores.reduce((sum, s) => sum + s, 0) / attemptedScores.length;
				// outputScore is stored 0-100 in the progress domain (ProgressRepoImpl converts to/from 0-1)
				const outputScore = Math.round(avgScore * 100);
				await this.progressRepo.upsert(userId, exercise.lessonId, { outputScore });
			}
		}

		return { attempt, runResult };
	}
}
