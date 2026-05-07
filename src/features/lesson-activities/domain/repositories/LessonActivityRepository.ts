import type { LessonActivityEntity } from "../entities/LessonActivityEntity.ts";

export interface LessonActivityRepository {
	findById(id: string): Promise<LessonActivityEntity | null>;
	findByLessonId(lessonId: string): Promise<LessonActivityEntity[]>;
	create(activity: LessonActivityEntity): Promise<LessonActivityEntity>;
	delete(id: string): Promise<void>;
	reorder(
		lessonId: string,
		activityId: string,
		newPosition: number,
	): Promise<void>;
}
