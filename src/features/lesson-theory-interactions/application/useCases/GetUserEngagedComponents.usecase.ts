import type { IUserActivityProgressRepo } from "../../domain/repositories/IUserActivityProgressRepo.ts";
import type { TheoryInteractionComponentType } from "../../domain/types/LessonTheoryInteraction.type.ts";
import { THEORY_INTERACTION_COMPONENTS } from "../../domain/types/LessonTheoryInteraction.type.ts";

export class GetUserEngagedComponentsUseCase {
	constructor(private readonly activityProgressRepo: IUserActivityProgressRepo) {}

	async execute(userId: string, lessonId: string): Promise<TheoryInteractionComponentType[]> {
		const components = await this.activityProgressRepo.getCompletedComponents(userId, lessonId);
		return components.filter((c): c is TheoryInteractionComponentType =>
			THEORY_INTERACTION_COMPONENTS.includes(c as TheoryInteractionComponentType),
		);
	}
}
