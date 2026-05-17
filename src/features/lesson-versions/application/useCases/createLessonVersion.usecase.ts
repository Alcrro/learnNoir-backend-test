import type { ILessonVersionRepository } from "../../domain/repositories/ILessonVersionRepository.ts";
import type { LessonVersion, CreateLessonVersionDTO } from "../../domain/types/LessonVersion.type.ts";

export class CreateLessonVersionUseCase {
	constructor(private readonly repo: ILessonVersionRepository) {}

	async execute(lessonId: string, dto: CreateLessonVersionDTO): Promise<LessonVersion> {
		return this.repo.create(lessonId, dto);
	}
}
