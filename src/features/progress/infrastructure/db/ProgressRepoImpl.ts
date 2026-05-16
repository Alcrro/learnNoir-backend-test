import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import type { Database } from "../../../../database.types";
import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type {
	LessonProgress,
	LessonProgressWithLesson,
	UpsertProgressInput,
} from "../../domain/types/LessonProgress.type";

type ProgressRow = Database["public"]["Tables"]["user_lesson_progress"]["Row"];

// Converts a Supabase row to the domain type.
function toDomain(row: ProgressRow): LessonProgress {
	return {
		id: row.id,
		userId: row.user_id,
		lessonId: row.lesson_id,
		// Supabase stores status as a generic string; cast to the narrower union.
		status: (row.status ?? "not_started") as LessonProgress["status"],
		weightedScore: row.weighted_score ?? 0,
		quizScore: row.quiz_score ?? 0,
		readScore: row.read_score ?? 0,
		outputScore: row.output_score ?? 0,
		lastActivityAt: row.last_activity_at ?? null,
		createdAt: row.created_at ?? null,
		updatedAt: row.updated_at ?? null,
	};
}

// Computes a composite score as the average of the three component scores.
function computeWeightedScore(quiz: number, read: number, output: number): number {
	return Math.round((quiz + read + output) / 3);
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

		const quizScore = input.quizScore ?? existing?.quizScore ?? 0;
		const readScore = input.readScore ?? existing?.readScore ?? 0;
		const outputScore = input.outputScore ?? existing?.outputScore ?? 0;
		const weightedScore = computeWeightedScore(quizScore, readScore, outputScore);

		// status defaults to "in_progress" on first touch if the caller doesn't specify one.
		const status = input.status ?? existing?.status ?? "in_progress";

		const now = new Date().toISOString();

		const { data, error } = await this.db
			.from("user_lesson_progress")
			.upsert(
				{
					user_id: userId,
					lesson_id: lessonId,
					status,
					weighted_score: weightedScore,
					quiz_score: quizScore,
					read_score: readScore,
					output_score: outputScore,
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
}
