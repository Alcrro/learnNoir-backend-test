import type { IExerciseRepo } from "../../domain/repositories/IExerciseRepo.ts";
import type { Exercise } from "../../domain/types/Exercise.type.ts";

export class GetExercisesByLessonUseCase {
	constructor(private readonly exerciseRepo: IExerciseRepo) {}

	async execute(lessonId: string): Promise<Exercise[]> {
		return this.exerciseRepo.findByLesson(lessonId);
	}
}
