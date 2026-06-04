import type { ITheoryLevelExplanationRepo } from "../../domain/repositories/ITheoryLevelExplanationRepo.ts";
import type { TheoryLevelAIService } from "../../infrastructure/ai/TheoryLevelAIService.ts";
import type {
	TheoryLevelExplanation,
	ExplanationLevel,
} from "../../domain/types/TheoryLevelExplanation.type.ts";

export type GetExplanationByLevelInput = {
	lessonBlockId: string;
	level: ExplanationLevel;
	isPro: boolean;
	theoryContent: string;
	lessonTitle: string;
};

export class GetExplanationByLevelUseCase {
	constructor(
		private readonly repo: ITheoryLevelExplanationRepo,
		private readonly aiService: TheoryLevelAIService,
	) {}

	async execute(input: GetExplanationByLevelInput): Promise<TheoryLevelExplanation | null> {
		const existing = await this.repo.findByBlockAndLevel(input.lessonBlockId, input.level);
		if (existing) return existing;

		if (!input.isPro) return null;

		if (input.theoryContent.trim().length < 20) return null;

		const content = await this.aiService.generateExplanation(
			input.lessonBlockId,
			input.level,
			input.theoryContent,
			input.lessonTitle,
			false,
		);

		return this.repo.upsert(input.lessonBlockId, {
			level: input.level,
			content,
			source: "ai",
		});
	}
}
