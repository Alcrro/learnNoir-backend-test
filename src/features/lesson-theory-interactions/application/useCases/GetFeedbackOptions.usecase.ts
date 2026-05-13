import type { IFeedbackOptionsRepo } from "../../domain/repositories/IFeedbackOptionsRepo.ts";
import type { FeedbackOption } from "../../domain/types/FeedbackOption.type.ts";

export class GetFeedbackOptionsUseCase {
	constructor(private repo: IFeedbackOptionsRepo) {}

	execute(componentType: string): Promise<FeedbackOption[]> {
		return this.repo.getByComponentType(componentType);
	}
}
