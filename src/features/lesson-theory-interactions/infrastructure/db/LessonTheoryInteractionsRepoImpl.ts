import { supabase } from "../../../../core/db/supabaseClient.ts";
import type { ILessonTheoryInteractionsRepo } from "../../domain/repositories/ILessonTheoryInteractionsRepo.ts";
import type {
	LessonTheoryInteraction,
	TheoryInteractionComponentType,
	TheoryInteractionContent,
	TheoryInteractionStatus,
} from "../../domain/types/LessonTheoryInteraction.type.ts";

type DbRow = {
	id: string;
	lesson_id: string;
	component_type: string;
	content: unknown;
	status: string;
	version: number;
	created_at: string;
	updated_at: string;
	created_by: string | null;
};

function toDomain(row: DbRow): LessonTheoryInteraction {
	return {
		id: row.id,
		lessonId: row.lesson_id,
		componentType: row.component_type as TheoryInteractionComponentType,
		content: row.content as TheoryInteractionContent,
		status: row.status as TheoryInteractionStatus,
		version: row.version,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		createdBy: row.created_by,
	};
}

export class LessonTheoryInteractionsRepoImpl implements ILessonTheoryInteractionsRepo {
	async getApprovedByLesson(lessonId: string): Promise<LessonTheoryInteraction[]> {
		// Get latest approved per component type
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.select("*")
			.eq("lesson_id", lessonId)
			.eq("status", "approved")
			.order("version", { ascending: false });

		if (error) throw new Error(error.message);
		if (!data) return [];

		// Keep only the latest version per component
		const seen = new Set<string>();
		const result: LessonTheoryInteraction[] = [];
		for (const row of data as DbRow[]) {
			if (!seen.has(row.component_type)) {
				seen.add(row.component_type);
				result.push(toDomain(row));
			}
		}
		return result;
	}

	async getAllByLesson(lessonId: string): Promise<LessonTheoryInteraction[]> {
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.select("*")
			.eq("lesson_id", lessonId)
			.order("component_type", { ascending: true })
			.order("version", { ascending: false });

		if (error) throw new Error(error.message);
		return (data as DbRow[] ?? []).map(toDomain);
	}

	async findById(id: string): Promise<LessonTheoryInteraction | null> {
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw new Error(error.message);
		if (!data) return null;
		return toDomain(data as DbRow);
	}

	async create(input: {
		lessonId: string;
		componentType: TheoryInteractionComponentType;
		content: TheoryInteractionContent;
		version: number;
		createdBy: string | null;
	}): Promise<LessonTheoryInteraction> {
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.insert({
				lesson_id: input.lessonId,
				component_type: input.componentType,
				content: input.content as unknown as import("../../../../database.types.ts").Json,
				status: "draft",
				version: input.version,
				created_by: input.createdBy,
			})
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toDomain(data as DbRow);
	}

	async updateContent(id: string, content: TheoryInteractionContent): Promise<LessonTheoryInteraction> {
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.update({
				content: content as unknown as import("../../../../database.types.ts").Json,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toDomain(data as DbRow);
	}

	async approve(id: string): Promise<LessonTheoryInteraction> {
		const { data, error } = await supabase
			.from("lesson_theory_interactions")
			.update({ status: "approved", updated_at: new Date().toISOString() })
			.eq("id", id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toDomain(data as DbRow);
	}
}
