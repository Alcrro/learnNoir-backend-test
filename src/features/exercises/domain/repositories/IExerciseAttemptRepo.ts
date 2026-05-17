import type { ExerciseAttempt } from "../types/Exercise.type.ts";

export type InsertAttemptInput = {
	userId: string;
	exerciseId: string;
	code: string;
	status: "passed" | "failed" | "error";
	passedTests: number;
	totalTests: number;
	hintsUsed: number;
	score: number;
	executionTimeMs: number | null;
};

export type ExerciseBestResult = {
	exerciseId: string;
	score: number;
	status: string;
};

export interface IExerciseAttemptRepo {
	insert(data: InsertAttemptInput): Promise<ExerciseAttempt>;
	findBestByUserAndLesson(userId: string, lessonId: string): Promise<ExerciseBestResult[]>;
}
