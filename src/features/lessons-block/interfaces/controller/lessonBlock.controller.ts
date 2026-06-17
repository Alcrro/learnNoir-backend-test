import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../utils/errors/AppError";
import { parseCreateLessonBlockDTO } from "../../application/dto/LessonBlock.dto";
import type { CreateLessonBlockUseCase } from "../../application/useCases/createLessonBlockUseCase.usecase";
import { GetLessonBlockUsecase } from "../../application/useCases/getLessonBlockUsecase.usecase";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { GetBlocksByLessonIdUseCase } from "../../application/useCases/getBlocksByLessonIdUseCase";
import type { UpdateContentBlockUseCase } from "../../application/useCases/updateContentBlockUseCase";
import type { UpdateBlockDataUseCase } from "../../application/useCases/updateBlockDataUseCase";
import type { GetBlocksPreviewUseCase } from "../../application/useCases/GetBlocksPreviewUseCase";

export class LessonBlockController {
	constructor(
		private readonly lessonBlockServices: {
			getLessonBlockById: GetLessonBlockUsecase;
			getBlocksByLessonId: GetBlocksByLessonIdUseCase;
			getBlocksPreview: GetBlocksPreviewUseCase;
			createLessonBlock: CreateLessonBlockUseCase;
			updateContent: UpdateContentBlockUseCase;
			updateBlockData: UpdateBlockDataUseCase;
		},
	) {}

	findOne = asyncHandlerMiddleware(
		async (req: Request, res: Response, _next: NextFunction) => {
			const id = readRequiredString(req.params.id, "Lesson block id is required");

			const lessonBlock =
				await this.lessonBlockServices.getLessonBlockById.execute(id);

			return res.status(200).json({ data: lessonBlock });
		},
	);

	// Returns all blocks for a lesson in ascending position order.
	findByLessonId = asyncHandlerMiddleware(
		async (req: Request, res: Response, _next: NextFunction) => {
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			const blocks =
				await this.lessonBlockServices.getBlocksByLessonId.execute(lessonId);

			return res.status(200).json({ data: blocks });
		},
	);

	// Returns free-tier preview: all content+interactive blocks + first 4 assessment blocks.
	findPreviewByLessonId = asyncHandlerMiddleware(
		async (req: Request, res: Response, _next: NextFunction) => {
			const lessonId = readRequiredString(req.params.lessonId, "Lesson id is required");

			const blocks =
				await this.lessonBlockServices.getBlocksPreview.execute(lessonId);

			return res.status(200).json({ data: blocks });
		},
	);

	updateContent = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const id = readRequiredString(req.params.id, "Block id is required");
			const { content } = req.body as { content?: unknown };
			if (!Array.isArray(content)) {
				throw new AppError("content must be an array", 400);
			}
			await this.lessonBlockServices.updateContent.execute(
				id,
				content as Record<string, unknown>[],
			);
			return res.status(200).json({ data: null });
		},
	);

	updateBlockData = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const id = readRequiredString(req.params.id, "Block id is required");
			const { data } = req.body as { data?: unknown };
			if (!isObject(data)) {
				throw new AppError("data must be an object", 400);
			}
			await this.lessonBlockServices.updateBlockData.execute(id, data);
			return res.status(200).json({ data: null });
		},
	);

	createLessonBlock = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			if (!isObject(req.body)) {
				throw new AppError("Lesson block payload is required", 400);
			}

			const payload = parseCreateLessonBlockDTO(req.body);

			const createdLessonBlock =
				await this.lessonBlockServices.createLessonBlock.execute(payload);

			return res.status(201).json({ data: createdLessonBlock });
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
