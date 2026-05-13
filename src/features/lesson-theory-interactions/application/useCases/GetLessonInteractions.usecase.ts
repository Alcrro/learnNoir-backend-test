import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type { InteractionResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";
import { toResponseDTO } from "../dto/LessonTheoryInteraction.dto.ts";

export class GetApprovedLessonInteractionsUseCase {
	constructor(private repo: ILessonTheoryInteractionsRepo) {}

	async execute(lessonId: string): Promise<InteractionResponseDTO[]> {
		const interactions = await this.repo.getApprovedByLesson(lessonId);
		return interactions.map(toResponseDTO);
	}
}

export class GetAllLessonInteractionsUseCase {
	constructor(private repo: ILessonTheoryInteractionsRepo) {}

	async execute(lessonId: string): Promise<InteractionResponseDTO[]> {
		const interactions = await this.repo.getAllByLesson(lessonId);
		return interactions.map(toResponseDTO);
	}
}
