import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";

export class UpsertQuizBlockScoreUseCase {
	constructor(private readonly repo: ProgressRepository) {}

	execute(userId: string, blockId: string, score: number) {
		return this.repo.upsertQuizBlockScore(userId, blockId, score);
	}
}
