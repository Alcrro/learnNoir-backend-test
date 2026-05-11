import type { ILessonRepository, LessonEditEntry } from "../../domain/repositories/LeasonRepository";

export class GetLessonHistoryUseCase {
	constructor(private readonly lessonRepo: ILessonRepository) {}

	async execute(lessonId: string): Promise<LessonEditEntry[]> {
		return this.lessonRepo.getHistory(lessonId);
	}
}
