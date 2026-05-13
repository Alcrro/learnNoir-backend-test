import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { InteractionResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { toResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";

export class ApproveInteractionUseCase {
	constructor(private repo: ILessonTheoryInteractionsRepo) {}

	async execute(interactionId: string): Promise<InteractionResponseDTO> {
		const existing = await this.repo.findById(interactionId);
		if (!existing) throw new AppError("Interaction not found", 404);

		const approved = await this.repo.approve(interactionId);
		return toResponseDTO(approved);
	}
}
