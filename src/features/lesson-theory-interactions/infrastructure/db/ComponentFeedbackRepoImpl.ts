import { supabase } from "../../../../core/db/supabaseClient.ts";
import type { IComponentFeedbackRepo } from "../../domain/repositories/IComponentFeedbackRepo.ts";
import type { ComponentFeedbackCounts, ComponentFeedbackVote } from "../../domain/types/ComponentFeedback.type.ts";

export class ComponentFeedbackRepoImpl implements IComponentFeedbackRepo {
	async getCounts(lessonId: string, componentId: string, userId: string | null): Promise<ComponentFeedbackCounts> {
		const { data, error } = await supabase
			.from("lesson_component_feedback")
			.select("vote, user_id")
			.eq("lesson_id", lessonId)
			.eq("component_id", componentId);

		if (error) throw new Error(error.message);

		const rows = (data ?? []) as { vote: string; user_id: string }[];
		const upvotes = rows.filter((r) => r.vote === "up").length;
		const downvotes = rows.filter((r) => r.vote === "down").length;
		const myRow = userId ? rows.find((r) => r.user_id === userId) : null;
		const myVote = myRow ? (myRow.vote as ComponentFeedbackVote) : null;

		return { upvotes, downvotes, myVote };
	}

	async upsert(lessonId: string, componentId: string, userId: string, vote: ComponentFeedbackVote, message?: string, selectedOptionIds?: string[]): Promise<void> {
		const { error } = await supabase
			.from("lesson_component_feedback")
			.upsert(
				{
					lesson_id: lessonId,
					component_id: componentId,
					user_id: userId,
					vote,
					message: message ?? null,
					selected_option_ids: selectedOptionIds ?? [],
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "lesson_id,component_id,user_id" },
			);

		if (error) throw new Error(error.message);
	}

	async delete(lessonId: string, componentId: string, userId: string): Promise<void> {
		const { error } = await supabase
			.from("lesson_component_feedback")
			.delete()
			.eq("lesson_id", lessonId)
			.eq("component_id", componentId)
			.eq("user_id", userId);

		if (error) throw new Error(error.message);
	}
}
