import type { SupabaseClient } from "@supabase/supabase-js";
import {
	BadRequestError,
	DatabaseError,
	NotFoundError,
} from "../../../../utils/errors/DatabaseError.ts";
import type { LessonActivityEntity } from "../../domain/entities/LessonActivityEntity.ts";
import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";
import { LessonActivityMapper } from "../mapper/LessonActivity.mapper.ts";
import type { Database } from "../../../../database.types.ts";

export class LessonActivityRepoImpl implements LessonActivityRepository {
	constructor(private readonly db: SupabaseClient<Database>) {}

	async findById(id: string): Promise<LessonActivityEntity | null> {
		const { data, error } = await this.db
			.from("lesson_activities")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw new DatabaseError(error.message);
		return data ? LessonActivityMapper.toDomain(data) : null;
	}

	async findByLessonId(lessonId: string): Promise<LessonActivityEntity[]> {
		const { data, error } = await this.db
			.from("lesson_activities")
			.select("*")
			.eq("lesson_id", lessonId)
			.order("position", { ascending: true });

		if (error) throw new DatabaseError(error.message);
		return (data ?? []).map((row) => LessonActivityMapper.toDomain(row));
	}

	async create(activity: LessonActivityEntity): Promise<LessonActivityEntity> {
		const payload = LessonActivityMapper.toInsert(activity);
		const { data, error } = await this.db
			.from("lesson_activities")
			.insert(payload)
			.select("*")
			.single();

		if (error) throw new DatabaseError(error.message);
		return LessonActivityMapper.toDomain(data);
	}

	async delete(id: string): Promise<void> {
		const activity = await this.findById(id);
		if (!activity) throw new NotFoundError("Lesson activity not found");

		const { error } = await this.db
			.from("lesson_activities")
			.delete()
			.eq("id", id);

		if (error) throw new DatabaseError(error.message);

		const remaining = await this.findByLessonId(activity.lessonId);
		await this.persistOrderedActivities(remaining);
	}

	async reorder(
		lessonId: string,
		activityId: string,
		newPosition: number,
	): Promise<void> {
		if (!Number.isInteger(newPosition) || newPosition < 0) {
			throw new BadRequestError("New position must be a non-negative integer");
		}

		const activities = await this.findByLessonId(lessonId);
		const currentIndex = activities.findIndex((a) => a.id === activityId);

		if (currentIndex === -1) throw new NotFoundError("Lesson activity not found");
		if (newPosition >= activities.length) {
			throw new BadRequestError("New position is outside activity range");
		}

		const [toMove] = activities.splice(currentIndex, 1);
		if (!toMove) throw new NotFoundError("Lesson activity not found");

		activities.splice(newPosition, 0, toMove);
		await this.persistOrderedActivities(activities);
	}

	private async persistOrderedActivities(activities: LessonActivityEntity[]) {
		for (let i = 0; i < activities.length; i += 1) {
			const activity = activities[i];
			if (!activity) continue;

			activity.moveTo(i);

			const { error } = await this.db
				.from("lesson_activities")
				.update({ position: activity.position })
				.eq("id", activity.id);

			if (error) throw new DatabaseError(error.message);
		}
	}
}
