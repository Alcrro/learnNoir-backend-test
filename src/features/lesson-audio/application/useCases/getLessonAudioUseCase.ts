import type { LessonAudioRepository } from "../../domain/repositories/LessonAudioRepository.ts";
import type { LessonAudio } from "../../domain/types/lessonAudio.types.ts";

export class GetLessonAudioUseCase {
	constructor(private readonly audioRepo: LessonAudioRepository) {}

	async execute(lessonId: string): Promise<LessonAudio | null> {
		return this.audioRepo.findByLessonId(lessonId);
	}
}
