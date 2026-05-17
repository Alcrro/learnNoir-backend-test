import { supabase } from "../../../../core/db/supabaseClient.ts";
import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import type { IExerciseRepo } from "../../domain/repositories/IExerciseRepo.ts";
import type { Exercise, ExerciseExample, ExerciseTestCase } from "../../domain/types/Exercise.type.ts";

type DbRow = {
	id: string;
	lesson_id: string;
	algorithm_id: string;
	title: string;
	difficulty: "easy" | "medium" | "hard";
	description: string;
	examples: unknown;
	constraints: unknown;
	hints: unknown;
	starter_code: string;
	test_cases: unknown;
	tags: string[];
	position: number;
	created_at: string | null;
};

function toDomain(row: DbRow): Exercise {
	return {
		id: row.id,
		lessonId: row.lesson_id,
		algorithmId: row.algorithm_id,
		title: row.title,
		difficulty: row.difficulty,
		description: row.description,
		examples: row.examples as ExerciseExample[],
		constraints: row.constraints as string[],
		hints: row.hints as string[],
		starterCode: row.starter_code,
		testCases: (row.test_cases as Array<{ input: unknown; expected: unknown; is_hidden: boolean; label?: string }>).map((tc) => ({
			input: tc.input,
			expected: tc.expected,
			isHidden: tc.is_hidden,
			label: tc.label,
		})) as ExerciseTestCase[],
		tags: row.tags,
		position: row.position,
		createdAt: row.created_at,
	};
}

export class ExerciseRepoImpl implements IExerciseRepo {
	async findByLesson(lessonId: string): Promise<Exercise[]> {
		const { data, error } = await supabase
			.from("exercises")
			.select("*")
			.eq("lesson_id", lessonId)
			.order("position", { ascending: true });

		if (error) throw new DatabaseError(error.message);
		return (data as DbRow[] ?? []).map(toDomain);
	}

	async findById(id: string): Promise<Exercise | null> {
		const { data, error } = await supabase
			.from("exercises")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);
		if (!data) return null;
		return toDomain(data as DbRow);
	}
}
