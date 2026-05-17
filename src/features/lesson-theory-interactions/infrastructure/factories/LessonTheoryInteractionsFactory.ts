import { LessonTheoryInteractionsRepoImpl } from "../db/LessonTheoryInteractionsRepoImpl.ts";
import { ComponentFeedbackRepoImpl } from "../db/ComponentFeedbackRepoImpl.ts";
import { FeedbackOptionsRepoImpl } from "../db/FeedbackOptionsRepoImpl.ts";
import { TheoryInteractionAttemptRepoImpl } from "../db/TheoryInteractionAttemptRepoImpl.ts";
import { UserActivityProgressRepoImpl } from "../db/UserActivityProgressRepoImpl.ts";
import { LessonTheoryInteractionsAIService } from "../ai/LessonTheoryInteractionsAIService.ts";
import { GenerateTheoryInteractionUseCase } from "../../application/useCases/GenerateTheoryInteraction.usecase.ts";
import { GetApprovedLessonInteractionsUseCase, GetAllLessonInteractionsUseCase } from "../../application/useCases/GetLessonInteractions.usecase.ts";
import { ApproveInteractionUseCase } from "../../application/useCases/ApproveInteraction.usecase.ts";
import { UpdateInteractionUseCase } from "../../application/useCases/UpdateInteraction.usecase.ts";
import { GetComponentFeedbackUseCase } from "../../application/useCases/GetComponentFeedback.usecase.ts";
import { UpsertComponentFeedbackUseCase } from "../../application/useCases/UpsertComponentFeedback.usecase.ts";
import { DeleteComponentFeedbackUseCase } from "../../application/useCases/DeleteComponentFeedback.usecase.ts";
import { GetFeedbackOptionsUseCase } from "../../application/useCases/GetFeedbackOptions.usecase.ts";
import { RecordTheoryAttemptUseCase } from "../../application/useCases/RecordTheoryAttempt.usecase.ts";
import { GetUserTheoryAttemptsUseCase } from "../../application/useCases/GetUserTheoryAttempts.usecase.ts";
import { EngageTheoryComponentUseCase } from "../../application/useCases/EngageTheoryComponent.usecase.ts";
import { GetUserEngagedComponentsUseCase } from "../../application/useCases/GetUserEngagedComponents.usecase.ts";
import { ProgressRepoImpl } from "../../../progress/infrastructure/db/ProgressRepoImpl.ts";
import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonTheoryInteractionsController } from "../../interfaces/controllers/LessonTheoryInteractions.controller.ts";

export function createLessonTheoryInteractionsController(): LessonTheoryInteractionsController {
	const repo = new LessonTheoryInteractionsRepoImpl();
	const feedbackRepo = new ComponentFeedbackRepoImpl();
	const feedbackOptionsRepo = new FeedbackOptionsRepoImpl();
	const attemptRepo = new TheoryInteractionAttemptRepoImpl();
	const activityProgressRepo = new UserActivityProgressRepoImpl();
	const progressRepo = new ProgressRepoImpl(supabase);
	const aiService = new LessonTheoryInteractionsAIService();

	const generateUseCase = new GenerateTheoryInteractionUseCase(repo, aiService);
	const getApprovedUseCase = new GetApprovedLessonInteractionsUseCase(repo);
	const getAllUseCase = new GetAllLessonInteractionsUseCase(repo);
	const approveUseCase = new ApproveInteractionUseCase(repo);
	const updateUseCase = new UpdateInteractionUseCase(repo);
	const getFeedbackUseCase = new GetComponentFeedbackUseCase(feedbackRepo);
	const upsertFeedbackUseCase = new UpsertComponentFeedbackUseCase(feedbackRepo);
	const deleteFeedbackUseCase = new DeleteComponentFeedbackUseCase(feedbackRepo);
	const getFeedbackOptionsUseCase = new GetFeedbackOptionsUseCase(feedbackOptionsRepo);
	const recordAttemptUseCase = new RecordTheoryAttemptUseCase(repo, attemptRepo, activityProgressRepo, progressRepo);
	const getUserAttemptsUseCase = new GetUserTheoryAttemptsUseCase(attemptRepo);
	const engageComponentUseCase = new EngageTheoryComponentUseCase(repo, activityProgressRepo, progressRepo);
	const getEngagedComponentsUseCase = new GetUserEngagedComponentsUseCase(activityProgressRepo);

	return new LessonTheoryInteractionsController(
		generateUseCase,
		getApprovedUseCase,
		getAllUseCase,
		approveUseCase,
		updateUseCase,
		getFeedbackUseCase,
		upsertFeedbackUseCase,
		deleteFeedbackUseCase,
		getFeedbackOptionsUseCase,
		recordAttemptUseCase,
		getUserAttemptsUseCase,
		engageComponentUseCase,
		getEngagedComponentsUseCase,
	);
}
