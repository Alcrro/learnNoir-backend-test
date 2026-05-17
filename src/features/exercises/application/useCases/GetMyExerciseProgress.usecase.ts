import type { IExerciseAttemptRepo, ExerciseBestResult } from "../../domain/repositories/IExerciseAttemptRepo.ts";

export class GetMyExerciseProgressUseCase {
	constructor(private readonly attemptRepo: IExerciseAttemptRepo) {}

	async execute(userId: string, lessonId: string): Promise<ExerciseBestResult[]> {
		return this.attemptRepo.findBestByUserAndLesson(userId, lessonId);
	}
}
