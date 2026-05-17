export interface IUserActivityProgressRepo {
	/** Returns the activity_id linked to the given theory interaction, or null if none. */
	findActivityIdByInteraction(interactionId: string): Promise<string | null>;

	/**
	 * Finds an existing activity for lesson+componentType, or creates one on-the-fly.
	 * Returns null for passive components (concrete_example) that have no trackable activity.
	 * theoryInteractionId is optional — used to link the created activity to an approved interaction.
	 */
	findOrCreateActivityForComponent(
		lessonId: string,
		componentType: string,
		theoryInteractionId: string | null,
	): Promise<string | null>;

	/**
	 * Upserts user_activity_progress for a single activity.
	 * Uses best-score semantics: score is only updated if newScore > existing score.
	 */
	upsert(userId: string, activityId: string, score: number, status: "in_progress" | "completed"): Promise<void>;

	/**
	 * Computes the weighted average quiz score across all quiz+exercise activities for a lesson.
	 * Activities without progress count as score 0.
	 */
	computeWeightedQuizScore(userId: string, lessonId: string): Promise<number>;

	/**
	 * Returns the component_type values of all theory activities the user has completed (score > 0).
	 */
	getCompletedComponents(userId: string, lessonId: string): Promise<string[]>;
}
