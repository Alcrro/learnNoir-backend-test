import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../utils/errors/AppError";
import { parseCreateLessonBlockDTO } from "../../application/dto/LessonBlock.dto";
import type { CreateLessonBlockUseCase } from "../../application/useCases/createLessonBlockUseCase.usecase";
import { GetLessonBlockUsecase } from "../../application/useCases/getLessonBlockUsecase.usecase";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { GetBlocksByLessonIdUseCase } from "../../application/useCases/getBlocksByLessonIdUseCase";

export class LessonBlockController {
	constructor(
		private readonly lessonBlockServices: {
			getLessonBlockById: GetLessonBlockUsecase;
			getBlocksByLessonId: GetBlocksByLessonIdUseCase;
			createLessonBlock: CreateLessonBlockUseCase;
		},
	) {}

	findOne = asyncHandlerMiddleware(
		async (req: Request, res: Response, _next: NextFunction) => {
			const id = readRequiredString(req.params.id, "Lesson block id is required");

			const lessonBlock =
				await this.lessonBlockServices.getLessonBlockById.execute(id);

			return res.status(200).json({
				success: true,
				message: `Lesson block ${id} successfully found`,
				lessonBlock,
			});
		},
	);

	// Returns all blocks for a lesson in ascending position order.
	findByLessonId = asyncHandlerMiddleware(
		async (req: Request, res: Response, _next: NextFunction) => {
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			const blocks =
				await this.lessonBlockServices.getBlocksByLessonId.execute(lessonId);

			return res.status(200).json({
				success: true,
				data: blocks,
			});
		},
	);

	createLessonBlock = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			if (!isObject(req.body)) {
				throw new AppError("Lesson block payload is required", 400);
			}

			console.log(req.body);

			const payload = parseCreateLessonBlockDTO(req.body);

			console.log(payload);

			const createdLessonBlock =
				await this.lessonBlockServices.createLessonBlock.execute(payload);

			return res.status(201).json({
				success: true,
				message: `Lesson block ${createdLessonBlock.id} successfully created`,
				createdLessonBlock,
			});
		},
	);
}

function readRequiredString(value: unknown, errorMessage: string) {
	if (typeof value === "string" && value.trim().length > 0) {
		return value;
	}

	throw new AppError(errorMessage, 400);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
