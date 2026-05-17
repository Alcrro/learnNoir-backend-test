import type { ILessonVersionRepository } from "../../domain/repositories/ILessonVersionRepository.ts";
import type { LessonVersion } from "../../domain/types/LessonVersion.type.ts";

export class ListLessonVersionsUseCase {
	constructor(private readonly repo: ILessonVersionRepository) {}

	async execute(lessonId: string): Promise<LessonVersion[]> {
		return this.repo.findByLessonId(lessonId);
	}
}
