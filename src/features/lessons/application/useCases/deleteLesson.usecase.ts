import type { ILessonRepository } from "../../domain/repositories/LeasonRepository";

export class DeleteLessonUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(id: string): Promise<void> {
		await this.lessonRepo.delete(id);
	}
}
