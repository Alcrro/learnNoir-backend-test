import type { ITheoryLevelExplanationRepo } from "../../domain/repositories/ITheoryLevelExplanationRepo.ts";
import type { TheoryLevelAIService } from "../../infrastructure/ai/TheoryLevelAIService.ts";
import type {
	TheoryLevelExplanation,
	ExplanationLevel,
} from "../../domain/types/TheoryLevelExplanation.type.ts";

export class GenerateExplanationForTeacherUseCase {
	constructor(
		private readonly repo: ITheoryLevelExplanationRepo,
		private readonly aiService: TheoryLevelAIService,
	) {}

	async execute(
		lessonBlockId: string,
		level: ExplanationLevel,
		theoryContent: string,
		lessonTitle: string,
	): Promise<TheoryLevelExplanation> {
		if (theoryContent.trim().length < 20) {
			throw new Error("Conținutul blocului de teorie este prea scurt pentru a genera o explicație.");
		}

		const content = await this.aiService.generateExplanation(
			lessonBlockId,
			level,
			theoryContent,
			lessonTitle,
			true, // forceRefresh — teacher poate regenera oricând
		);

		return this.repo.upsert(lessonBlockId, { level, content, source: "ai" });
	}
}
