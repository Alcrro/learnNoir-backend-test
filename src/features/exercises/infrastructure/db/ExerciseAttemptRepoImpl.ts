import { supabase } from "../../../../core/db/supabaseClient.ts";
import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import type { IExerciseAttemptRepo, InsertAttemptInput, ExerciseBestResult } from "../../domain/repositories/IExerciseAttemptRepo.ts";
import type { ExerciseAttempt } from "../../domain/types/Exercise.type.ts";

type DbRow = {
	id: string;
	user_id: string;
	exercise_id: string;
	code: string;
	status: "passed" | "failed" | "error";
	passed_tests: number;
	total_tests: number;
	hints_used: number;
	score: number;
	execution_time_ms: number | null;
	created_at: string | null;
};

function toDomain(row: DbRow): ExerciseAttempt {
	return {
		id: row.id,
		userId: row.user_id,
		exerciseId: row.exercise_id,
		code: row.code,
		status: row.status,
		passedTests: row.passed_tests,
		totalTests: row.total_tests,
		hintsUsed: row.hints_used,
		score: row.score,
		executionTimeMs: row.execution_time_ms,
		createdAt: row.created_at,
	};
}

export class ExerciseAttemptRepoImpl implements IExerciseAttemptRepo {
	async insert(data: InsertAttemptInput): Promise<ExerciseAttempt> {
		const { data: row, error } = await supabase
			.from("exercise_attempts")
			.insert({
				user_id: data.userId,
				exercise_id: data.exerciseId,
				code: data.code,
				status: data.status,
				passed_tests: data.passedTests,
				total_tests: data.totalTests,
				hints_used: data.hintsUsed,
				score: data.score,
				execution_time_ms: data.executionTimeMs,
			})
			.select()
			.single();

		if (error) throw new DatabaseError(error.message);
		return toDomain(row as DbRow);
	}

	async findBestByUserAndLesson(userId: string, lessonId: string): Promise<ExerciseBestResult[]> {
		// Fetch all exercises for this lesson so we can join by exercise_id
		const { data: exercises, error: exercisesError } = await supabase
			.from("exercises")
			.select("id")
			.eq("lesson_id", lessonId);

		if (exercisesError) throw new DatabaseError(exercisesError.message);
		if (!exercises || exercises.length === 0) return [];

		const exerciseIds = exercises.map((e) => e.id);

		const { data: attempts, error } = await supabase
			.from("exercise_attempts")
			.select("exercise_id, score, status")
			.eq("user_id", userId)
			.in("exercise_id", exerciseIds)
			.order("score", { ascending: false });

		if (error) throw new DatabaseError(error.message);
		if (!attempts || attempts.length === 0) return [];

		// Keep best score per exercise
		const bestMap = new Map<string, ExerciseBestResult>();
		for (const attempt of attempts as Array<{ exercise_id: string; score: number; status: string }>) {
			const existing = bestMap.get(attempt.exercise_id);
			if (!existing || attempt.score > existing.score) {
				bestMap.set(attempt.exercise_id, {
					exerciseId: attempt.exercise_id,
					score: attempt.score,
					status: attempt.status,
				});
			}
		}

		return Array.from(bestMap.values());
	}
}
