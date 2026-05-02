/**
 * Represents a user's attempt to complete a lesson.
 *
 * One Attempt = one session of a user going through a lesson.
 * It aggregates results from all assessment blocks.
 */
export type Attempt = {
	/** Unique identifier of the attempt */
	id: string;

	/** The user who is taking the lesson */
	userId: string;

	/** The lesson being attempted */
	lessonId: string;

	/**
	 * Total score achieved in this attempt.
	 * Can be:
	 * - raw points (e.g. 80)
	 * - percentage (e.g. 80%)
	 * Must be consistent across system.
	 */
	score: number;

	/** When the attempt started */
	startedAt: Date;

	/** When the attempt was completed (null if ongoing) */
	completedAt?: Date;
};
