import { supabase } from "../../../../core/db/supabaseClient";
import { GetLessonProgressUseCase } from "../../application/useCases/getLessonProgressUseCase";
import { UpsertLessonProgressUseCase } from "../../application/useCases/upsertLessonProgressUseCase";
import { ProgressRepoImpl } from "../db/ProgressRepoImpl";
import { ProgressController } from "../../interfaces/controller/progress.controller";

// Wires up the Supabase repo, both use cases, and the controller in one call.
export function progressControllerFactory(): ProgressController {
	const progressRepo = new ProgressRepoImpl(supabase);

	return new ProgressController({
		getLessonProgress: new GetLessonProgressUseCase(progressRepo),
		upsertLessonProgress: new UpsertLessonProgressUseCase(progressRepo),
	});
}
