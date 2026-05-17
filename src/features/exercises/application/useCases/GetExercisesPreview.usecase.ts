import type { IExerciseRepo } from "../../domain/repositories/IExerciseRepo.ts";
import type { Exercise } from "../../domain/types/Exercise.type.ts";

const FREE_EXERCISE_LIMIT = 2;

export class GetExercisesPreviewUseCase {
	constructor(private readonly exerciseRepo: IExerciseRepo) {}

	async execute(lessonId: string): Promise<Exercise[]> {
		const exercises = await this.exerciseRepo.findByLesson(lessonId);
		return exercises.slice(0, FREE_EXERCISE_LIMIT);
	}
}
