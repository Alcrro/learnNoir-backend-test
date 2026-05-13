import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { UpdateInteractionDTO, InteractionResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { toResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";

export class UpdateInteractionUseCase {
	constructor(private repo: ILessonTheoryInteractionsRepo) {}

	async execute(dto: UpdateInteractionDTO): Promise<InteractionResponseDTO> {
		const existing = await this.repo.findById(dto.interactionId);
		if (!existing) throw new AppError("Interaction not found", 404);

		const updated = await this.repo.updateContent(dto.interactionId, dto.content);
		return toResponseDTO(updated);
	}
}
