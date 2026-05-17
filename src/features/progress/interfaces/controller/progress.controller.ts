import type { Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { RequestWithUserId } from "../../../auth/interfaces/controllers/Auth.controller";
import type { GetLessonProgressUseCase } from "../../application/useCases/getLessonProgressUseCase";
import type { GetUserProgressUseCase } from "../../application/useCases/getUserProgressUseCase";
import type { UpsertLessonProgressUseCase } from "../../application/useCases/upsertLessonProgressUseCase";
import type { GetQuizBlockScoresUseCase } from "../../application/useCases/getQuizBlockScoresUseCase";
import type { UpsertQuizBlockScoreUseCase } from "../../application/useCases/upsertQuizBlockScoreUseCase";
import type { UpsertProgressInput } from "../../domain/types/LessonProgress.type";

export class ProgressController {
	constructor(
		private readonly services: {
			getLessonProgress: GetLessonProgressUseCase;
			getUserProgress: GetUserProgressUseCase;
			upsertLessonProgress: UpsertLessonProgressUseCase;
			getQuizBlockScores: GetQuizBlockScoresUseCase;
			upsertQuizBlockScore: UpsertQuizBlockScoreUseCase;
		},
	) {}

	// GET /progress/me
	// Returns all progress rows for the current user, each joined with lesson + module metadata.
	getUserProgress = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const userId = req.userId;
			if (!userId) return res.status(401).json({ error: "Unauthorized" });

			const progress = await this.services.getUserProgress.execute(userId);

			return res.status(200).json({ data: progress });
		},
	);

	// GET /progress/lesson/:lessonId
	// Returns the current user's progress for the lesson. 200 with data: null when not started.
	getLessonProgress = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const userId = req.userId;
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			if (!userId) return res.status(401).json({ error: "Unauthorized" });

			const progress = await this.services.getLessonProgress.execute(userId, lessonId);

			return res.status(200).json({ data: progress });
		},
	);

	// PATCH /progress/lesson/:lessonId
	// Creates or updates the progress row. Body fields are all optional.
	upsertLessonProgress = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const userId = req.userId;
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			if (!userId) return res.status(401).json({ error: "Unauthorized" });

			// Accept only the fields defined in UpsertProgressInput; ignore the rest.
			// Build the input object without undefined keys to satisfy exactOptionalPropertyTypes.
			const body = req.body as Partial<UpsertProgressInput>;
			const input: UpsertProgressInput = {};
			if (body.status !== undefined) input.status = body.status;
			if (body.quizScore !== undefined) input.quizScore = body.quizScore;
			if (body.readScore !== undefined) input.readScore = body.readScore;
			if (body.outputScore !== undefined) input.outputScore = body.outputScore;

			const progress = await this.services.upsertLessonProgress.execute(
				userId,
				lessonId,
				input,
			);

			return res.status(200).json({ data: progress });
		},
	);

	// GET /progress/lesson/:lessonId/quiz-blocks
	getQuizBlockScores = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const userId = req.userId;
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			if (!userId) return res.status(401).json({ error: "Unauthorized" });

			const scores = await this.services.getQuizBlockScores.execute(userId, lessonId);
			return res.status(200).json({ data: scores });
		},
	);

	// POST /progress/lesson/:lessonId/quiz-block/:blockId
	upsertQuizBlockScore = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const userId = req.userId;
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");
			const blockId = readRequiredString(req.params.blockId, "Block id is required");

			if (!userId) return res.status(401).json({ error: "Unauthorized" });

			const body = req.body as { score?: unknown };
			if (typeof body.score !== "number" || body.score < 0 || body.score > 100) {
				return res.status(400).json({ error: "score must be a number 0-100" });
			}

			// lessonId is accepted but not needed for the upsert — blockId is the natural key.
			void lessonId;

			const result = await this.services.upsertQuizBlockScore.execute(userId, blockId, body.score);
			return res.status(200).json({ data: result });
		},
	);
}

function readRequiredString(value: unknown, errorMessage: string): string {
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw new Error(errorMessage);
}
