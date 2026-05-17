import type { LessonVideo } from "../types/lessonVideo.types.ts";

export interface LessonVideoRepository {
	findByLessonId(lessonId: string): Promise<LessonVideo | null>;
	upsert(video: Omit<LessonVideo, "id" | "generatedAt">): Promise<LessonVideo>;
}
