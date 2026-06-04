import type { LessonBlockEntity } from "../../../lessons-block/domain/entities/LessonBlockEntity";
import type { LessonBlockRepository } from "../../../lessons-block/domain/repositories/LessonBlockRepository";
import { LessonBlockFactory } from "../../../lessons-block/domain/factories/lessonBlock.factory";
import type { LessonAIService } from "../../infrastructure/ai/lessonAI.service";
import type { ILessonRepository } from "../../domain/repositories/LessonRepository";

export class GenerateBlocksFromTextUseCase {
	private readonly factory = new LessonBlockFactory();

	constructor(
		private readonly ai: LessonAIService,
		private readonly blockRepo: LessonBlockRepository,
		private readonly lessonRepo: ILessonRepository,
	) {}

	async execute(lessonId: string, text: string): Promise<LessonBlockEntity> {
		const lesson = await this.lessonRepo.get(lessonId);
		const lessonContext: { title: string; description?: string } = { title: lesson.title };
		if (lesson.description) lessonContext.description = lesson.description;
		const nodes = await this.ai.generateStructuredBlocks(text, lessonContext);

		const existingBlocks = await this.blockRepo.findByLessonId(lessonId);
		const position = existingBlocks.length;

		const block = this.factory.create({
			type: "content",
			lessonId,
			data: { content: nodes },
			position,
		});

		return this.blockRepo.create(block);
	}
}
