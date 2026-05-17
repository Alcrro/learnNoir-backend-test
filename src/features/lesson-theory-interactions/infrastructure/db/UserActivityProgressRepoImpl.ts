import { supabase } from "../../../../core/db/supabaseClient.ts";
import type { IUserActivityProgressRepo } from "../../domain/repositories/IUserActivityProgressRepo.ts";

const COMPONENT_ACTIVITY_CONFIG: Record<string, { type: string; weight: number; title: string }> = {
	predict_prompt: { type: "content", weight: 0.05, title: "Hook & Predict" },
	elaboration: { type: "content", weight: 0.05, title: "Elaboration" },
	interactive_exercise: { type: "exercise", weight: 0.10, title: "Interactive Exercise" },
	transfer: { type: "quiz", weight: 0.10, title: "Transfer Scenario" },
	recall_1: { type: "quiz", weight: 0.15, title: "Recall Check 1" },
	recall_2: { type: "quiz", weight: 0.15, title: "Recall Check 2" },
	recall_final: { type: "quiz", weight: 0.15, title: "Final Recall" },
	// concrete_example → no activity (passive visual)
};

export class UserActivityProgressRepoImpl implements IUserActivityProgressRepo {
	async findActivityIdByInteraction(interactionId: string): Promise<string | null> {
		const { data, error } = await supabase
			.from("lesson_activities")
			.select("id")
			.eq("theory_interaction_id", interactionId)
			.maybeSingle();

		if (error) throw new Error(error.message);
		return (data as { id: string } | null)?.id ?? null;
	}

	async findOrCreateActivityForComponent(
		lessonId: string,
		componentType: string,
		theoryInteractionId: string | null,
	): Promise<string | null> {
		const config = COMPONENT_ACTIVITY_CONFIG[componentType];
		if (!config) return null;

		// Look for an existing activity for this lesson+componentType
		const { data: existing, error: findErr } = await supabase
			.from("lesson_activities")
			.select("id")
			.eq("lesson_id", lessonId)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.eq("component_type" as any, componentType)
			.maybeSingle();

		if (findErr) throw new Error(findErr.message);
		if (existing) return (existing as { id: string }).id;

		// Not found — compute next position
		const { data: maxPos } = await supabase
			.from("lesson_activities")
			.select("position")
			.eq("lesson_id", lessonId)
			.order("position", { ascending: false })
			.limit(1)
			.maybeSingle();

		const position = ((maxPos as { position: number } | null)?.position ?? 0) + 1;

		const insertPayload: Record<string, unknown> = {
			lesson_id: lessonId,
			type: config.type,
			title: config.title,
			position,
			required: false,
			weight: config.weight,
			component_type: componentType,
		};
		if (theoryInteractionId) insertPayload["theory_interaction_id"] = theoryInteractionId;

		const { data: created, error: insertErr } = await supabase
			.from("lesson_activities")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.insert(insertPayload as any)
			.select("id")
			.single();

		if (insertErr) {
			// Unique constraint violation = concurrent insert won — re-fetch
			if (insertErr.code === "23505") {
				const { data: retried } = await supabase
					.from("lesson_activities")
					.select("id")
					.eq("lesson_id", lessonId)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					.eq("component_type" as any, componentType)
					.maybeSingle();
				return retried ? (retried as { id: string }).id : null;
			}
			throw new Error(insertErr.message);
		}

		return (created as { id: string }).id;
	}

	async upsert(
		userId: string,
		activityId: string,
		score: number,
		status: "in_progress" | "completed",
	): Promise<void> {
		// Best-score semantics: read current score first, keep the higher value
		const { data: existing } = await supabase
			.from("user_activity_progress")
			.select("score")
			.eq("user_id", userId)
			.eq("activity_id", activityId)
			.maybeSingle();

		const existingScore = (existing as { score: number | null } | null)?.score ?? 0;
		const bestScore = Math.max(score, existingScore);

		// Keep status as 'completed' once reached — don't downgrade on a retry
		const existingStatus = existing ? "completed" : null;
		const resolvedStatus = existingStatus === "completed" ? "completed" : status;

		const { error } = await supabase
			.from("user_activity_progress")
			.upsert(
				{
					user_id: userId,
					activity_id: activityId,
					score: bestScore,
					status: resolvedStatus,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "user_id,activity_id" },
			);

		if (error) throw new Error(error.message);
	}

	async getCompletedComponents(userId: string, lessonId: string): Promise<string[]> {
		const { data: activities, error: actErr } = await supabase
			.from("lesson_activities")
			.select("id, component_type")
			.eq("lesson_id", lessonId)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.not("component_type" as any, "is", null);

		if (actErr) throw new Error(actErr.message);
		if (!activities || activities.length === 0) return [];

		const activityIds = activities.map((a) => a.id);

		const { data: progress, error: progErr } = await supabase
			.from("user_activity_progress")
			.select("activity_id")
			.eq("user_id", userId)
			.in("activity_id", activityIds)
			.gt("score", 0);

		if (progErr) throw new Error(progErr.message);
		if (!progress || progress.length === 0) return [];

		const completedIds = new Set(progress.map((p) => p.activity_id));
		return activities
			.filter((a) => completedIds.has(a.id))
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((a) => (a as any).component_type as string)
			.filter(Boolean);
	}

	async computeWeightedQuizScore(userId: string, lessonId: string): Promise<number> {
		// Get all quiz+exercise activities for the lesson
		const { data: activities, error: actErr } = await supabase
			.from("lesson_activities")
			.select("id, weight")
			.eq("lesson_id", lessonId)
			.in("type", ["quiz", "exercise"]);

		if (actErr) throw new Error(actErr.message);
		if (!activities || activities.length === 0) return 0;

		const activityRows = activities as { id: string; weight: number }[];
		const totalWeight = activityRows.reduce((sum, a) => sum + a.weight, 0);
		if (totalWeight === 0) return 0;

		// Get progress for those activities
		const { data: progressRows, error: progErr } = await supabase
			.from("user_activity_progress")
			.select("activity_id, score")
			.eq("user_id", userId)
			.in("activity_id", activityRows.map((a) => a.id));

		if (progErr) throw new Error(progErr.message);

		const progressMap = new Map<string, number>();
		for (const row of (progressRows ?? []) as { activity_id: string; score: number | null }[]) {
			progressMap.set(row.activity_id, row.score ?? 0);
		}

		const weightedSum = activityRows.reduce((sum, a) => {
			return sum + (progressMap.get(a.id) ?? 0) * a.weight;
		}, 0);

		// Scores in user_activity_progress are 0-1; domain expects 0-100.
		return (weightedSum / totalWeight) * 100;
	}
}
