import type { ITheoryInteractionAttemptRepo } from "../../domain/repositories/ITheoryInteractionAttemptRepo.ts";
import type { TheoryInteractionAttempt } from "../../domain/types/TheoryInteractionAttempt.type.ts";

export class GetUserTheoryAttemptsUseCase {
	constructor(private readonly attemptRepo: ITheoryInteractionAttemptRepo) {}

	async execute(userId: string, lessonId: string): Promise<TheoryInteractionAttempt[]> {
		return this.attemptRepo.findByUserAndLesson(userId, lessonId);
	}
}
