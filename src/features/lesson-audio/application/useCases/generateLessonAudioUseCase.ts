import type { LessonAudioRepository } from "../../domain/repositories/LessonAudioRepository.ts";
import type { LessonAudio } from "../../domain/types/lessonAudio.types.ts";
import type { LessonAudioAIService } from "../../infrastructure/ai/LessonAudioAIService.ts";
import type { SupabaseAudioStorage } from "../../infrastructure/storage/SupabaseAudioStorage.ts";
import type { LessonBlockRepository } from "../../../lessons-block/domain/repositories/LessonBlockRepository.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export class GenerateLessonAudioUseCase {
	constructor(
		private readonly audioRepo: LessonAudioRepository,
		private readonly blockRepo: LessonBlockRepository,
		private readonly aiService: LessonAudioAIService,
		private readonly storage: SupabaseAudioStorage,
	) {}

	async execute(lessonId: string): Promise<LessonAudio> {
		const blocks = await this.blockRepo.findByLessonId(lessonId);
		const contentBlocks = blocks.filter((b) => b.type === "content");

		if (contentBlocks.length === 0) {
			throw new NotFoundError("No content blocks found for this lesson");
		}

		const allNodes = contentBlocks.flatMap((b) => {
			const data = b.toPrimitives();
			if (data.type !== "content") return [];
			return (data.data.content ?? []) as Record<string, unknown>[];
		});

		const segments = await this.aiService.generateScript(allNodes);
		const audioBuffer = await this.aiService.generateAudio(segments);
		const audioUrl = await this.storage.upload(lessonId, audioBuffer);

		return this.audioRepo.upsert({ lessonId, script: segments, audioUrl });
	}
}
