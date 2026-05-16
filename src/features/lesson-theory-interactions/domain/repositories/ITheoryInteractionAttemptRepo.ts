import type {
	TheoryInteractionAttempt,
	InsertTheoryAttemptInput,
} from "../types/TheoryInteractionAttempt.type.ts";

export interface ITheoryInteractionAttemptRepo {
	insert(input: InsertTheoryAttemptInput): Promise<TheoryInteractionAttempt>;
	/** Returns 1-based next attempt number for this user+interaction pair. */
	getNextAttemptNumber(userId: string, interactionId: string): Promise<number>;
	findByUserAndLesson(userId: string, lessonId: string): Promise<TheoryInteractionAttempt[]>;
}
