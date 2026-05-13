import type { IComponentFeedbackRepo } from "../../domain/repositories/IComponentFeedbackRepo.ts";

export class DeleteComponentFeedbackUseCase {
	constructor(private repo: IComponentFeedbackRepo) {}

	execute(lessonId: string, componentId: string, userId: string): Promise<void> {
		return this.repo.delete(lessonId, componentId, userId);
	}
}
