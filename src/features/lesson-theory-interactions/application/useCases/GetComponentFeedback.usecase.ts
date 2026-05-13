import type { IComponentFeedbackRepo } from "../../domain/repositories/IComponentFeedbackRepo.ts";
import type { ComponentFeedbackCounts } from "../../domain/types/ComponentFeedback.type.ts";

export class GetComponentFeedbackUseCase {
	constructor(private repo: IComponentFeedbackRepo) {}

	execute(lessonId: string, componentId: string, userId: string | null): Promise<ComponentFeedbackCounts> {
		return this.repo.getCounts(lessonId, componentId, userId);
	}
}
