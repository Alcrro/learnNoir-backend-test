import type { IComponentFeedbackRepo } from "../../domain/repositories/IComponentFeedbackRepo.ts";
import type { ComponentFeedbackVote } from "../../domain/types/ComponentFeedback.type.ts";

export class UpsertComponentFeedbackUseCase {
	constructor(private repo: IComponentFeedbackRepo) {}

	execute(input: {
		lessonId: string;
		componentId: string;
		userId: string;
		vote: ComponentFeedbackVote;
		message?: string;
		selectedOptionIds?: string[];
	}): Promise<void> {
		return this.repo.upsert(input.lessonId, input.componentId, input.userId, input.vote, input.message, input.selectedOptionIds);
	}
}
