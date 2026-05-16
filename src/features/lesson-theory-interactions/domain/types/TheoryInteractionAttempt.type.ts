export type TheoryInteractionAttempt = {
	id: string;
	userId: string;
	interactionId: string;
	/** null for non-evaluated components (predict_prompt, elaboration) */
	isCorrect: boolean | null;
	chosenAnswer: unknown;
	/** null for non-evaluated components */
	correctAnswer: unknown | null;
	attemptNumber: number;
	createdAt: string;
};

export type InsertTheoryAttemptInput = {
	userId: string;
	interactionId: string;
	isCorrect: boolean | null;
	chosenAnswer: unknown;
	correctAnswer: unknown | null;
	attemptNumber: number;
};
