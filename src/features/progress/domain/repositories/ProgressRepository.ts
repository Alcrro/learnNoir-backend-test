import type { LessonProgress, UpsertProgressInput } from "../types/LessonProgress.type";

export interface ProgressRepository {
	// Returns the row for this user+lesson pair, or null if it does not exist yet.
	getByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null>;

	// Creates a new row or updates the existing one (upsert on user_id + lesson_id).
	upsert(userId: string, lessonId: string, input: UpsertProgressInput): Promise<LessonProgress>;
}
