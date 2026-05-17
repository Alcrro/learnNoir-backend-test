import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import type { Database } from "../../../../database.types";
import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type {
	LessonProgress,
	LessonProgressWithLesson,
	UpsertProgressInput,
	QuizBlockScore,
} from "../../domain/types/LessonProgress.type";

type ProgressRow = Database["public"]["Tables"]["user_lesson_progress"]["Row"];

// Converts a Supabase row to the domain type.
// DB stores scores as 0.0-1.0; domain exposes them as 0-100.
function toDomain(row: ProgressRow): LessonProgress {
	return {
		id: row.id,
		userId: row.user_id,
		lessonId: row.lesson_id,
		status: (row.status ?? "not_started") as LessonProgress["status"],
		weightedScore: Math.round((row.weighted_score ?? 0) * 100),
		quizScore: Math.round((row.quiz_score ?? 0) * 100),
		readScore: Math.round((row.read_score ?? 0) * 100),
		outputScore: Math.round((row.output_score ?? 0) * 100),
		lastActivityAt: row.last_activity_at ?? null,
		createdAt: row.created_at ?? null,
		updatedAt: row.updated_at ?? null,
	};
}

// Computes a composite score (0-100) as the average of the three component scores.
function computeWeightedScore(quiz: number, read: number, output: number): number {
	// Exercises (output) are optional — they improve the score but don't cap it.
	// Without exercises: average of read + quiz (max 100).
	// With exercises: average of all three (max 100, same ceiling but harder to reach without exercises).
	const divisor = output > 0 ? 3 : 2;
	return Math.round((quiz + read + output) / divisor);
}

export class ProgressRepoImpl implements ProgressRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async getAllByUser(userId: string): Promise<LessonProgressWithLesson[]> {
		const { data, error } = await this.db
			.from("user_lesson_progress")
			.select(
				`*, lessons!lesson_id ( title, slug, status, modules!module_id ( name ) )`,
			)
			.eq("user_id", userId)
			.order("last_activity_at", { ascending: false });

		if (error) throw new DatabaseError(error.message);

		return (data ?? []).map((row) => {
			const lesson = row.lessons as {
				title: string;
				slug: string;
				status: string | null;
				modules: { name: string } | null;
			} | null;

			return {
				...toDomain(row),
				lessonTitle: lesson?.title ?? "Untitled lesson",
				lessonSlug: lesson?.slug ?? "",
				lessonStatus: lesson?.status ?? "draft",
				moduleName: lesson?.modules?.name ?? "",
			};
		});
	}

	async getByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null> {
		const { data, error } = await this.db
			.from("user_lesson_progress")
			.select("*")
			.eq("user_id", userId)
			.eq("lesson_id", lessonId)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);

		return data ? toDomain(data) : null;
	}

	async upsert(
		userId: string,
		lessonId: string,
		input: UpsertProgressInput,
	): Promise<LessonProgress> {
		// Read the current row so we can merge partial updates with existing values.
		const existing = await this.getByUserAndLesson(userId, lessonId);

		// Best-score semantics for all three dimensions — never downgrade a saved score.
		const quizScore = Math.max(input.quizScore ?? 0, existing?.quizScore ?? 0);
		const readScore = Math.max(input.readScore ?? 0, existing?.readScore ?? 0);
		const outputScore = Math.max(input.outputScore ?? 0, existing?.outputScore ?? 0);
		const weightedScore = computeWeightedScore(quizScore, readScore, outputScore);

		// Never downgrade a "completed" status.
		const requestedStatus = input.status ?? existing?.status ?? "in_progress";
		const status = existing?.status === "completed" ? "completed" : requestedStatus;

		const now = new Date().toISOString();

		const { data, error } = await this.db
			.from("user_lesson_progress")
			.upsert(
				{
					user_id: userId,
					lesson_id: lessonId,
					status,
					// Domain values are 0-100; DB constraint expects 0.0-1.0.
					weighted_score: weightedScore / 100,
					quiz_score: quizScore / 100,
					read_score: readScore / 100,
					output_score: outputScore / 100,
					last_activity_at: now,
					updated_at: now,
				},
				// Supabase upsert conflict resolution — match on the composite natural key.
				{ onConflict: "user_id,lesson_id" },
			)
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);

		return toDomain(data);
	}

	async getQuizBlockScores(userId: string, lessonId: string): Promise<QuizBlockScore[]> {
		// Join quiz_block_scores with lesson_blocks to filter by lesson.
		const { data, error } = await this.db
			.from("quiz_block_scores")
			.select("*, lesson_blocks!lesson_block_id(lesson_id)")
			.eq("user_id", userId)
			.eq("lesson_blocks.lesson_id", lessonId);

		if (error) throw new DatabaseError(error.message);

		return (data ?? []).map((row) => ({
			id: row.id,
			userId: row.user_id,
			lessonBlockId: row.lesson_block_id,
			score: row.score,
			passed: row.passed,
			attempts: row.attempts,
		}));
	}

	async upsertQuizBlockScore(userId: string, blockId: string, score: number): Promise<QuizBlockScore> {
		const now = new Date().toISOString();

		// Read existing to apply best-score semantics and increment attempts.
		const { data: existing } = await this.db
			.from("quiz_block_scores")
			.select("score, attempts")
			.eq("user_id", userId)
			.eq("lesson_block_id", blockId)
			.maybeSingle();

		const bestScore = Math.max(score, existing?.score ?? 0);
		const attempts = (existing?.attempts ?? 0) + 1;

		const { data, error } = await this.db
			.from("quiz_block_scores")
			.upsert(
				{
					user_id: userId,
					lesson_block_id: blockId,
					score: bestScore,
					passed: bestScore >= 70,
					attempts,
					updated_at: now,
				},
				{ onConflict: "user_id,lesson_block_id" },
			)
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);

		return {
			id: data.id,
			userId: data.user_id,
			lessonBlockId: data.lesson_block_id,
			score: data.score,
			passed: data.passed,
			attempts: data.attempts,
		};
	}
}
