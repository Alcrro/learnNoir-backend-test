import { supabase } from "../../../../core/db/supabaseClient.ts";
import type { IFeedbackOptionsRepo } from "../../domain/repositories/IFeedbackOptionsRepo.ts";
import type { FeedbackOption } from "../../domain/types/FeedbackOption.type.ts";

type DbRow = {
	id: string;
	component_type: string;
	label: string;
	position: number;
};

export class FeedbackOptionsRepoImpl implements IFeedbackOptionsRepo {
	async getByComponentType(componentType: string): Promise<FeedbackOption[]> {
		const { data, error } = await supabase
			.from("feedback_options")
			.select("id, component_type, label, position")
			.eq("component_type", componentType)
			.eq("is_active", true)
			.order("position", { ascending: true });

		if (error) throw new Error(error.message);
		return ((data ?? []) as DbRow[]).map((r) => ({
			id: r.id,
			componentType: r.component_type,
			label: r.label,
			position: r.position,
		}));
	}
}
