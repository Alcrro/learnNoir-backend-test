import type { ComponentFeedbackCounts, ComponentFeedbackVote } from "../types/ComponentFeedback.type.ts";

export interface IComponentFeedbackRepo {
	getCounts(lessonId: string, componentId: string, userId: string | null): Promise<ComponentFeedbackCounts>;
	upsert(lessonId: string, componentId: string, userId: string, vote: ComponentFeedbackVote, message?: string, selectedOptionIds?: string[]): Promise<void>;
	delete(lessonId: string, componentId: string, userId: string): Promise<void>;
}
