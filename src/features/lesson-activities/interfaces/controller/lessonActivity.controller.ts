import type { Request, Response } from "express";
import { AppError } from "../../../../utils/errors/AppError.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import type { CreateLessonActivityUseCase } from "../../application/useCases/createLessonActivityUseCase.usecase.ts";
import type { DeleteLessonActivityUseCase } from "../../application/useCases/deleteLessonActivityUseCase.usecase.ts";
import type { GetLessonActivitiesByLessonUseCase } from "../../application/useCases/getLessonActivitiesByLessonUseCase.usecase.ts";
import type { GetLessonActivityUseCase } from "../../application/useCases/getLessonActivityUseCase.usecase.ts";
import type { ReorderLessonActivityUseCase } from "../../application/useCases/reorderLessonActivityUseCase.usecase.ts";
import { parseCreateLessonActivityDTO } from "../../application/dto/LessonActivity.dto.ts";

export class LessonActivityController {
	constructor(
		private readonly services: {
			createLessonActivity: CreateLessonActivityUseCase;
			getLessonActivity: GetLessonActivityUseCase;
			getLessonActivitiesByLesson: GetLessonActivitiesByLessonUseCase;
			deleteLessonActivity: DeleteLessonActivityUseCase;
			reorderLessonActivity: ReorderLessonActivityUseCase;
		},
	) {}

	create = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const dto = parseCreateLessonActivityDTO(req.body);
		const activity = await this.services.createLessonActivity.execute(dto);
		return res.status(201).json({ data: activity });
	});

	findOne = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = requireString(req.params.id, "Activity id is required");
		const activity = await this.services.getLessonActivity.execute(id);
		return res.status(200).json({ data: activity });
	});

	findByLesson = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(
			req.params.lessonId,
			"Lesson id is required",
		);
		const activities =
			await this.services.getLessonActivitiesByLesson.execute(lessonId);
		return res.status(200).json({ data: activities });
	});

	remove = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = requireString(req.params.id, "Activity id is required");
		await this.services.deleteLessonActivity.execute(id);
		return res.status(200).json({ data: null });
	});

	reorder = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = requireString(req.params.id, "Activity id is required");
		const lessonId = requireString(req.body.lessonId, "Lesson id is required");
		const newPosition = requireNonNegativeInt(
			req.body.newPosition,
			"newPosition must be a non-negative integer",
		);
		await this.services.reorderLessonActivity.execute(
			lessonId,
			id,
			newPosition,
		);
		return res.status(200).json({ data: null });
	});
}

function requireString(value: unknown, msg: string): string {
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw new AppError(msg, 400);
}

function requireNonNegativeInt(value: unknown, msg: string): number {
	const n = Number(value);
	if (Number.isInteger(n) && n >= 0) return n;
	throw new AppError(msg, 400);
}
