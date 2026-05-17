import type { Exercise } from "../types/Exercise.type.ts";

export interface IExerciseRepo {
	findByLesson(lessonId: string): Promise<Exercise[]>;
	findById(id: string): Promise<Exercise | null>;
}
