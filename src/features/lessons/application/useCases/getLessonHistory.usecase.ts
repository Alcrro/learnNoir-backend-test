import type { ILessonQueryRepository } from "../repositories/ILessonQueryRepository.ts";
import type { LessonEditEntry } from "../../domain/repositories/LeasonRepository";

export class GetLessonHistoryUseCase {
	constructor(private readonly lessonQueryRepo: ILessonQueryRepository) {}

	async execute(lessonId: string): Promise<LessonEditEntry[]> {
		return this.lessonQueryRepo.getHistory(lessonId);
	}
}
