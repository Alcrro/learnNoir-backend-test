export type LessonAuthor = {
	userId: string;
	role: string | null;
};

/**
 * Represents the current persisted lesson shape plus selected relations used
 * by the lessons feature.
 */
export interface ILesson {
	/** Unique identifier of the lesson */
	id: string;

	/** Parent module that groups lessons like algorithms or data structures */
	moduleId: string;

	/** Title displayed to users */
	title: string;

	/** URL-safe identifier, usually derived from title */
	slug: string;

	/** Optional short summary of the lesson */
	description?: string | null;

	/** Estimated duration in seconds */
	durationSeconds: number;

	/** Order of the lesson inside a module */
	position: number | null;

	/** Whether the lesson is visible/active */
	isActive: boolean;

	/**
	 * Publishing state:
	 * - draft: not visible
	 * - reviewed: approved but not public
	 * - published: visible to students
	 */
	status: LessonStatus;

	/** Authors are stored in the `lesson_authors` relation */
	authors: LessonAuthor[];

	/** Creation timestamp */
	createdAt: Date;

	/** Last update timestamp */
	updatedAt: Date;
}

/**
 * Lifecycle status of a lesson
 */
export type LessonStatus =
	| "draft" // being edited
	| "reviewed" // validated by reviewer
	| "published"; // visible to students
