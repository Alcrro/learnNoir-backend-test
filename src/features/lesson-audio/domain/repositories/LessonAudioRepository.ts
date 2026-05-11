import type { LessonAudio } from "../types/lessonAudio.types.ts";

export interface LessonAudioRepository {
	findByLessonId(lessonId: string): Promise<LessonAudio | null>;
	upsert(audio: Omit<LessonAudio, "id" | "generatedAt">): Promise<LessonAudio>;
}
