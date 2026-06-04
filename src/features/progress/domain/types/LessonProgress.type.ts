// Mirrors the user_lesson_progress table. All score values are 0-100.
export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type LessonProgress = {
	id: string;
	userId: string;
	lessonId: string;
	status: ProgressStatus;
	// Composite score: average of the three component scores below.
	weightedScore: number;
	// Score earned from the quiz blocks (0-100).
	quizScore: number;
	// Score earned from reading/viewing content blocks (0-100).
	readScore: number;
	// Score earned from code/output blocks (0-100).
	outputScore: number;
	lastActivityAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
	nextReviewAt: string | null;
	lastReviewedAt: string | null;
	reviewCount: number;
};

// LessonProgress joined with lesson title, slug and module name.
// Returned by GET /progress/me.
export type LessonProgressWithLesson = LessonProgress & {
	lessonTitle: string;
	lessonSlug: string;
	lessonStatus: string;
	moduleName: string;
};

// Only the fields a client is allowed to update.
export type UpsertProgressInput = {
	status?: ProgressStatus;
	quizScore?: number;
	readScore?: number;
	outputScore?: number;
};

// Per-block quiz score (quiz_block_scores table).
export type QuizBlockScore = {
	id: string;
	userId: string;
	lessonBlockId: string;
	score: number;
	passed: boolean;
	attempts: number;
};
