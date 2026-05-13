import type { Request, Response } from "express";
import type { GenerateTheoryInteractionUseCase } from "../../application/useCases/GenerateTheoryInteraction.usecase.ts";
import type { GetApprovedLessonInteractionsUseCase, GetAllLessonInteractionsUseCase } from "../../application/useCases/GetLessonInteractions.usecase.ts";
import type { ApproveInteractionUseCase } from "../../application/useCases/ApproveInteraction.usecase.ts";
import type { UpdateInteractionUseCase } from "../../application/useCases/UpdateInteraction.usecase.ts";
import type { GetComponentFeedbackUseCase } from "../../application/useCases/GetComponentFeedback.usecase.ts";
import type { UpsertComponentFeedbackUseCase } from "../../application/useCases/UpsertComponentFeedback.usecase.ts";
import type { DeleteComponentFeedbackUseCase } from "../../application/useCases/DeleteComponentFeedback.usecase.ts";
import type { GetFeedbackOptionsUseCase } from "../../application/useCases/GetFeedbackOptions.usecase.ts";
import { THEORY_INTERACTION_COMPONENTS } from "../../domain/types/LessonTheoryInteraction.type.ts";
import type { TheoryInteractionComponentType, TheoryInteractionContent, LessonContextForAI } from "../../domain/types/LessonTheoryInteraction.type.ts";
import type { ComponentFeedbackVote } from "../../domain/types/ComponentFeedback.type.ts";

export class LessonTheoryInteractionsController {
	constructor(
		private generateUseCase: GenerateTheoryInteractionUseCase,
		private getApprovedUseCase: GetApprovedLessonInteractionsUseCase,
		private getAllUseCase: GetAllLessonInteractionsUseCase,
		private approveUseCase: ApproveInteractionUseCase,
		private updateUseCase: UpdateInteractionUseCase,
		private getFeedbackUseCase: GetComponentFeedbackUseCase,
		private upsertFeedbackUseCase: UpsertComponentFeedbackUseCase,
		private deleteFeedbackUseCase: DeleteComponentFeedbackUseCase,
		private getFeedbackOptionsUseCase: GetFeedbackOptionsUseCase,
	) {}

	/** GET /api/lessons/:lessonId/theory-interactions — approved only (students) */
	getApproved = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const interactions = await this.getApprovedUseCase.execute(lessonId);
		res.json({ data: interactions });
	};

	/** GET /api/lessons/:lessonId/theory-interactions/all — all versions (teachers) */
	getAll = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const interactions = await this.getAllUseCase.execute(lessonId);
		res.json({ data: interactions });
	};

	/** POST /api/lessons/:lessonId/theory-interactions/:component/generate */
	generate = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const component = req.params["component"] as string;

		if (!THEORY_INTERACTION_COMPONENTS.includes(component as TheoryInteractionComponentType)) {
			res.status(400).json({ error: `Invalid component type: ${component}` });
			return;
		}

		const lessonContext = req.body.lessonContext as LessonContextForAI;
		if (!lessonContext?.title) {
			res.status(400).json({ error: "lessonContext with at least title is required" });
			return;
		}

		const interaction = await this.generateUseCase.execute({
			lessonId,
			componentType: component as TheoryInteractionComponentType,
			lessonContext,
			userId: req.userId ?? null,
		});

		res.status(201).json({ data: interaction });
	};

	/** PATCH /api/lessons/:lessonId/theory-interactions/:interactionId/approve */
	approve = async (req: Request, res: Response): Promise<void> => {
		const interactionId = req.params["interactionId"] as string;
		const interaction = await this.approveUseCase.execute(interactionId);
		res.json({ data: interaction });
	};

	/** PATCH /api/lessons/:lessonId/theory-interactions/:interactionId */
	update = async (req: Request, res: Response): Promise<void> => {
		const interactionId = req.params["interactionId"] as string;
		const { content } = req.body as { content: TheoryInteractionContent };

		if (!content) {
			res.status(400).json({ error: "content is required" });
			return;
		}

		const interaction = await this.updateUseCase.execute({ interactionId, content });
		res.json({ data: interaction });
	};

	/** GET /api/lessons/:lessonId/theory-interactions/:componentId/feedback */
	getFeedback = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const componentId = req.params["componentId"] as string;
		const counts = await this.getFeedbackUseCase.execute(lessonId, componentId, req.userId ?? null);
		res.json({ data: counts });
	};

	/** POST /api/lessons/:lessonId/theory-interactions/:componentId/feedback */
	upsertFeedback = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const componentId = req.params["componentId"] as string;
		const userId = req.userId;

		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const { vote, message, selectedOptionIds } = req.body as { vote: string; message?: string; selectedOptionIds?: string[] };
		if (vote !== "up" && vote !== "down") {
			res.status(400).json({ error: "vote must be 'up' or 'down'" });
			return;
		}

		await this.upsertFeedbackUseCase.execute({
			lessonId,
			componentId,
			userId,
			vote: vote as ComponentFeedbackVote,
			...(message !== undefined && { message }),
			...(selectedOptionIds !== undefined && { selectedOptionIds }),
		});
		res.json({ success: true });
	};

	/** GET /api/lessons/:lessonId/theory-interactions/:componentId/feedback-options */
	getFeedbackOptions = async (req: Request, res: Response): Promise<void> => {
		const componentId = req.params["componentId"] as string;
		const options = await this.getFeedbackOptionsUseCase.execute(componentId);
		res.json({ data: options });
	};

	/** DELETE /api/lessons/:lessonId/theory-interactions/:componentId/feedback */
	deleteFeedback = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const componentId = req.params["componentId"] as string;
		const userId = req.userId;

		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		await this.deleteFeedbackUseCase.execute(lessonId, componentId, userId);
		res.json({ success: true });
	};
}
