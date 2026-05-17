import type { Request, Response } from "express";
import type { GetExercisesByLessonUseCase } from "../../application/useCases/GetExercisesByLesson.usecase.ts";
import type { RunCodeUseCase } from "../../application/useCases/RunCode.usecase.ts";
import type { SubmitExerciseUseCase } from "../../application/useCases/SubmitExercise.usecase.ts";
import type { GetMyExerciseProgressUseCase } from "../../application/useCases/GetMyExerciseProgress.usecase.ts";
import type { GetExercisesPreviewUseCase } from "../../application/useCases/GetExercisesPreview.usecase.ts";

export class ExerciseController {
	constructor(
		private readonly getByLessonUseCase: GetExercisesByLessonUseCase,
		private readonly runCodeUseCase: RunCodeUseCase,
		private readonly submitExerciseUseCase: SubmitExerciseUseCase,
		private readonly getMyProgressUseCase: GetMyExerciseProgressUseCase,
		private readonly getPreviewUseCase: GetExercisesPreviewUseCase,
	) {}

	/** GET /api/lessons/:lessonId/exercises */
	getByLesson = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const exercises = await this.getByLessonUseCase.execute(lessonId);
		res.json({ data: exercises });
	};

	/** GET /api/lessons/:lessonId/exercises/preview — free tier, first 2 exercises */
	getPreviewByLesson = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const exercises = await this.getPreviewUseCase.execute(lessonId);
		res.json({ data: exercises });
	};

	/** POST /api/exercises/:exerciseId/run */
	runCode = async (req: Request, res: Response): Promise<void> => {
		const exerciseId = req.params["exerciseId"] as string;
		const { code } = req.body as { code?: string };

		if (!code || typeof code !== "string") {
			res.status(400).json({ error: "code is required and must be a string" });
			return;
		}

		const result = await this.runCodeUseCase.execute(exerciseId, code);
		res.json({ data: result });
	};

	/** POST /api/exercises/:exerciseId/submit */
	submitExercise = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const exerciseId = req.params["exerciseId"] as string;
		const { code, hintsUsed } = req.body as { code?: string; hintsUsed?: number };

		if (!code || typeof code !== "string") {
			res.status(400).json({ error: "code is required and must be a string" });
			return;
		}

		const normalizedHintsUsed = typeof hintsUsed === "number" && hintsUsed >= 0 ? hintsUsed : 0;

		const result = await this.submitExerciseUseCase.execute(userId, exerciseId, code, normalizedHintsUsed);
		res.status(201).json({ data: result });
	};

	/** GET /api/lessons/:lessonId/exercises/my-progress */
	getMyProgress = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const lessonId = req.params["lessonId"] as string;
		const progress = await this.getMyProgressUseCase.execute(userId, lessonId);
		res.json({ data: progress });
	};
}
