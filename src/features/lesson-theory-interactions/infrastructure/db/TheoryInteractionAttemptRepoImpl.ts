import { supabase } from "../../../../core/db/supabaseClient.ts";
import type { Json } from "../../../../database.types.ts";
import type { ITheoryInteractionAttemptRepo } from "../../domain/repositories/ITheoryInteractionAttemptRepo.ts";
import type {
	TheoryInteractionAttempt,
	InsertTheoryAttemptInput,
} from "../../domain/types/TheoryInteractionAttempt.type.ts";

type DbRow = {
	id: string;
	user_id: string;
	interaction_id: string;
	is_correct: boolean | null;
	chosen_answer: unknown;
	correct_answer: unknown | null;
	attempt_number: number;
	created_at: string;
};

function toDomain(row: DbRow): TheoryInteractionAttempt {
	return {
		id: row.id,
		userId: row.user_id,
		interactionId: row.interaction_id,
		isCorrect: row.is_correct,
		chosenAnswer: row.chosen_answer,
		correctAnswer: row.correct_answer ?? null,
		attemptNumber: row.attempt_number,
		createdAt: row.created_at,
	};
}

export class TheoryInteractionAttemptRepoImpl implements ITheoryInteractionAttemptRepo {
	async insert(input: InsertTheoryAttemptInput): Promise<TheoryInteractionAttempt> {
		const { data, error } = await supabase
			.from("theory_interaction_attempts")
			.insert({
				user_id: input.userId,
				interaction_id: input.interactionId,
				is_correct: input.isCorrect ?? null,
				chosen_answer: input.chosenAnswer as unknown as Json,
				correct_answer: (input.correctAnswer ?? null) as unknown as Json,
				attempt_number: input.attemptNumber,
			})
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toDomain(data as DbRow);
	}

	async getNextAttemptNumber(userId: string, interactionId: string): Promise<number> {
		const { data, error } = await supabase
			.from("theory_interaction_attempts")
			.select("attempt_number")
			.eq("user_id", userId)
			.eq("interaction_id", interactionId)
			.order("attempt_number", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) throw new Error(error.message);
		return ((data as DbRow | null)?.attempt_number ?? 0) + 1;
	}

	async findByUserAndLesson(userId: string, lessonId: string): Promise<TheoryInteractionAttempt[]> {
		// Join through lesson_theory_interactions to filter by lesson
		const { data, error } = await supabase
			.from("theory_interaction_attempts")
			.select("*, lesson_theory_interactions!inner(lesson_id)")
			.eq("user_id", userId)
			.eq("lesson_theory_interactions.lesson_id", lessonId)
			.order("created_at", { ascending: true });

		if (error) throw new Error(error.message);
		return (data ?? []).map((row) => toDomain(row as DbRow));
	}
}
