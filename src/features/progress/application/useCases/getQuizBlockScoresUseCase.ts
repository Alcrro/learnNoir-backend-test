import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";

export class GetQuizBlockScoresUseCase {
	constructor(private readonly repo: ProgressRepository) {}

	execute(userId: string, lessonId: string) {
		return this.repo.getQuizBlockScores(userId, lessonId);
	}
}
