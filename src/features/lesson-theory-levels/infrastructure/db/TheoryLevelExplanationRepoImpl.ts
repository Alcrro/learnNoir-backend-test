import { supabase as typedSupabase } from "../../../../core/db/supabaseClient.ts";

// theory_level_explanations is a new table not yet reflected in database.types.ts.
// Cast to any to bypass the generated-types check until types are regenerated post-migration.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;
import type { ITheoryLevelExplanationRepo } from "../../domain/repositories/ITheoryLevelExplanationRepo.ts";
import type {
	TheoryLevelExplanation,
	ExplanationLevel,
	UpsertTheoryLevelExplanationInput,
} from "../../domain/types/TheoryLevelExplanation.type.ts";

type DbRow = {
	id: string;
	lesson_block_id: string;
	level: string;
	content: string;
	source: string;
	created_at: string;
	updated_at: string;
};

function toDomain(row: DbRow): TheoryLevelExplanation {
	return {
		id: row.id,
		lessonBlockId: row.lesson_block_id,
		level: row.level as ExplanationLevel,
		content: row.content,
		source: row.source as TheoryLevelExplanation["source"],
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

export class TheoryLevelExplanationRepoImpl implements ITheoryLevelExplanationRepo {
	async findByBlock(lessonBlockId: string): Promise<TheoryLevelExplanation[]> {
		const { data, error } = await supabase
			.from("theory_level_explanations")
			.select("*")
			.eq("lesson_block_id", lessonBlockId)
			.order("level", { ascending: true });

		if (error) throw new Error(error.message);
		return (data as DbRow[] ?? []).map(toDomain);
	}

	async findByBlockAndLevel(lessonBlockId: string, level: ExplanationLevel): Promise<TheoryLevelExplanation | null> {
		const { data, error } = await supabase
			.from("theory_level_explanations")
			.select("*")
			.eq("lesson_block_id", lessonBlockId)
			.eq("level", level)
			.maybeSingle();

		if (error) throw new Error(error.message);
		return data ? toDomain(data as DbRow) : null;
	}

	async upsert(lessonBlockId: string, input: UpsertTheoryLevelExplanationInput): Promise<TheoryLevelExplanation> {
		const { data, error } = await supabase
			.from("theory_level_explanations")
			.upsert(
				{
					lesson_block_id: lessonBlockId,
					level: input.level,
					content: input.content,
					source: input.source,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "lesson_block_id,level" },
			)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toDomain(data as DbRow);
	}

	async delete(lessonBlockId: string, level: ExplanationLevel): Promise<void> {
		const { error } = await supabase
			.from("theory_level_explanations")
			.delete()
			.eq("lesson_block_id", lessonBlockId)
			.eq("level", level);

		if (error) throw new Error(error.message);
	}
}
