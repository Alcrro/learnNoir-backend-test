import type { FeedbackOption } from "../types/FeedbackOption.type.ts";

export interface IFeedbackOptionsRepo {
	getByComponentType(componentType: string): Promise<FeedbackOption[]>;
}
