import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";

export class ReviewLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(id: string): Promise<void> {
		await this.lessonRepo.review(id);
	}
}
