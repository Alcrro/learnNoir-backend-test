import type { LessonBlockEntity } from "../../../lessons-block/domain/entities/LessonBlockEntity";
import type { LessonBlockRepository } from "../../../lessons-block/domain/repositories/LessonBlockRepository";
import { LessonBlockFactory } from "../../../lessons-block/domain/factories/lessonBlock.factory";
import type { LessonAIService } from "../../infrastructure/ai/lessonAI.service";

export class GenerateBlocksFromTextUseCase {
	private readonly factory = new LessonBlockFactory();

	constructor(
		private readonly ai: LessonAIService,
		private readonly blockRepo: LessonBlockRepository,
	) {}

	async execute(lessonId: string, text: string): Promise<LessonBlockEntity> {
		const nodes = await this.ai.generateStructuredBlocks(text);

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
