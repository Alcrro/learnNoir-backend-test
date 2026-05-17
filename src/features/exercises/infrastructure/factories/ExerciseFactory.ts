import { ExerciseRepoImpl } from "../db/ExerciseRepoImpl.ts";
import { ExerciseAttemptRepoImpl } from "../db/ExerciseAttemptRepoImpl.ts";
import { ProgressRepoImpl } from "../../../progress/infrastructure/db/ProgressRepoImpl.ts";
import { GetExercisesByLessonUseCase } from "../../application/useCases/GetExercisesByLesson.usecase.ts";
import { GetExercisesPreviewUseCase } from "../../application/useCases/GetExercisesPreview.usecase.ts";
import { RunCodeUseCase } from "../../application/useCases/RunCode.usecase.ts";
import { SubmitExerciseUseCase } from "../../application/useCases/SubmitExercise.usecase.ts";
import { GetMyExerciseProgressUseCase } from "../../application/useCases/GetMyExerciseProgress.usecase.ts";
import { ExerciseController } from "../../interfaces/controllers/Exercise.controller.ts";
import { supabase } from "../../../../core/db/supabaseClient.ts";

export function createExerciseController(): ExerciseController {
	const exerciseRepo = new ExerciseRepoImpl();
	const attemptRepo = new ExerciseAttemptRepoImpl();
	const progressRepo = new ProgressRepoImpl(supabase);

	const getByLessonUseCase = new GetExercisesByLessonUseCase(exerciseRepo);
	const getPreviewUseCase = new GetExercisesPreviewUseCase(exerciseRepo);
	const runCodeUseCase = new RunCodeUseCase(exerciseRepo);
	const submitExerciseUseCase = new SubmitExerciseUseCase(exerciseRepo, attemptRepo, progressRepo);
	const getMyProgressUseCase = new GetMyExerciseProgressUseCase(attemptRepo);

	return new ExerciseController(
		getByLessonUseCase,
		runCodeUseCase,
		submitExerciseUseCase,
		getMyProgressUseCase,
		getPreviewUseCase,
	);
}
