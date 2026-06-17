import type { LessonBlock, LessonTranslation } from "@shared/index.ts";
import type { ILessonRepository } from "../../../lessons/domain/repositories/LessonRepository.ts";
import type { LessonBlockRepository } from "../../../lessons-block/domain/repositories/LessonBlockRepository.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";

export interface ILessonTranslationAIService {
	translate(
		lessonId: string,
		lang: string,
		title: string,
		description: string | null,
		blocks: LessonBlock[],
		updatedAt: Date,
	): Promise<LessonTranslation>;
}

export class TranslateLessonUseCase {
	constructor(
		private readonly lessonRepo: ILessonRepository,
		private readonly blockRepo: LessonBlockRepository,
		private readonly aiService: ILessonTranslationAIService,
	) {}

	async execute(lessonId: string, lang: string): Promise<LessonTranslation> {
		const lesson = await this.lessonRepo.get(lessonId);

		if (!lesson) {
			throw new AppError("Lesson not found", 404);
		}

		const blockEntities = await this.blockRepo.findByLessonId(lessonId);
		const blocks: LessonBlock[] = blockEntities.map((b) => b.toPrimitives());

		return this.aiService.translate(lessonId, lang, lesson.title, lesson.description ?? null, blocks, lesson.updatedAt);
	}
}
