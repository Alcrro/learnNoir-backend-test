import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { LessonTheoryInteractionsAIService } from "../../infrastructure/ai/LessonTheoryInteractionsAIService.ts";
import type { GenerateInteractionDTO, InteractionResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { toResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";

export class GenerateTheoryInteractionUseCase {
	constructor(
		private repo: ILessonTheoryInteractionsRepo,
		private aiService: LessonTheoryInteractionsAIService,
	) {}

	async execute(dto: GenerateInteractionDTO): Promise<InteractionResponseDTO> {
		// Determine next version number
		const existing = await this.repo.getAllByLesson(dto.lessonId);
		const sameComponent = existing.filter((i) => i.componentType === dto.componentType);
		const version = sameComponent.length + 1;

		// Generate content via AI
		const content = await this.aiService.generate(dto.componentType, dto.lessonContext);

		// Persist as draft
		const interaction = await this.repo.create({
			lessonId: dto.lessonId,
			componentType: dto.componentType,
			content,
			version,
			createdBy: dto.userId,
		});

		return toResponseDTO(interaction);
	}
}
