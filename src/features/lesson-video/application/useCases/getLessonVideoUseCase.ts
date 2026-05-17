import type { LessonVideoRepository } from "../../domain/repositories/LessonVideoRepository.ts";
import type { LessonVideo } from "../../domain/types/lessonVideo.types.ts";

export class GetLessonVideoUseCase {
	constructor(private readonly videoRepo: LessonVideoRepository) {}

	async execute(lessonId: string): Promise<LessonVideo | null> {
		return this.videoRepo.findByLessonId(lessonId);
	}
}
