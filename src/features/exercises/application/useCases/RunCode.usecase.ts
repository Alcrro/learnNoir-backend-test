import type { IExerciseRepo } from "../../domain/repositories/IExerciseRepo.ts";
import type { CodeRunResult } from "../../domain/types/Exercise.type.ts";
import { runCode } from "../../infrastructure/sandbox/NodeSandbox.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export class RunCodeUseCase {
	constructor(private readonly exerciseRepo: IExerciseRepo) {}

	async execute(exerciseId: string, userCode: string): Promise<CodeRunResult> {
		const exercise = await this.exerciseRepo.findById(exerciseId);
		if (!exercise) throw new NotFoundError("Exercise not found");

		// Only run against visible (non-hidden) test cases
		const visibleTestCases = exercise.testCases.filter((tc) => !tc.isHidden);
		return runCode(userCode, visibleTestCases);
	}
}
