import { supabase } from "../../../../core/db/supabaseClient";
import { GetLessonProgressUseCase } from "../../application/useCases/getLessonProgressUseCase";
import { GetUserProgressUseCase } from "../../application/useCases/getUserProgressUseCase";
import { UpsertLessonProgressUseCase } from "../../application/useCases/upsertLessonProgressUseCase";
import { GetQuizBlockScoresUseCase } from "../../application/useCases/getQuizBlockScoresUseCase";
import { UpsertQuizBlockScoreUseCase } from "../../application/useCases/upsertQuizBlockScoreUseCase";
import { GetDueForReviewUseCase } from "../../application/useCases/getDueForReviewUseCase";
import { ProgressRepoImpl } from "../db/ProgressRepoImpl";
import { ProgressController } from "../../interfaces/controller/progress.controller";

// Wires up the Supabase repo, all use cases, and the controller in one call.
export function progressControllerFactory(): ProgressController {
	const progressRepo = new ProgressRepoImpl(supabase);

	return new ProgressController({
		getLessonProgress: new GetLessonProgressUseCase(progressRepo),
		getUserProgress: new GetUserProgressUseCase(progressRepo),
		upsertLessonProgress: new UpsertLessonProgressUseCase(progressRepo),
		getQuizBlockScores: new GetQuizBlockScoresUseCase(progressRepo),
		upsertQuizBlockScore: new UpsertQuizBlockScoreUseCase(progressRepo),
		getDueForReview: new GetDueForReviewUseCase(progressRepo),
	});
}
