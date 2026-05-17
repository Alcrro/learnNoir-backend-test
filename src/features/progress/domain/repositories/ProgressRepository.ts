import type {
	LessonProgress,
	LessonProgressWithLesson,
	UpsertProgressInput,
	QuizBlockScore,
} from "../types/LessonProgress.type";

export interface ProgressRepository {
	// Returns the row for this user+lesson pair, or null if it does not exist yet.
	getByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null>;

	// Returns all progress rows for the user, each joined with lesson + module metadata.
	getAllByUser(userId: string): Promise<LessonProgressWithLesson[]>;

	// Creates a new row or updates the existing one (upsert on user_id + lesson_id).
	upsert(userId: string, lessonId: string, input: UpsertProgressInput): Promise<LessonProgress>;

	// Returns per-block quiz scores for all assessment blocks in the lesson.
	getQuizBlockScores(userId: string, lessonId: string): Promise<QuizBlockScore[]>;

	// Upserts a quiz block score (best-score semantics).
	upsertQuizBlockScore(userId: string, blockId: string, score: number): Promise<QuizBlockScore>;
}
