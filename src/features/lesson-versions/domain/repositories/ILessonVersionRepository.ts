import type { LessonVersion, CreateLessonVersionDTO } from "../types/LessonVersion.type.ts";

export interface ILessonVersionRepository {
	findById(id: string): Promise<LessonVersion | null>;
	findByLessonId(lessonId: string): Promise<LessonVersion[]>;
	create(lessonId: string, dto: CreateLessonVersionDTO): Promise<LessonVersion>;
	publish(id: string): Promise<void>;
	unpublish(id: string): Promise<void>;
}
