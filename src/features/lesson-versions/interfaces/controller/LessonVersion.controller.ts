import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";
import type { CreateLessonVersionUseCase } from "../../application/useCases/createLessonVersion.usecase.ts";
import type { ListLessonVersionsUseCase } from "../../application/useCases/listLessonVersions.usecase.ts";
import type { GetLessonVersionUseCase } from "../../application/useCases/getLessonVersion.usecase.ts";
import type { PublishLessonVersionUseCase } from "../../application/useCases/publishLessonVersion.usecase.ts";

export class LessonVersionController {
	constructor(
		private readonly services: {
			create: CreateLessonVersionUseCase;
			list: ListLessonVersionsUseCase;
			get: GetLessonVersionUseCase;
			publish: PublishLessonVersionUseCase;
		},
	) {}

	list = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const versions = await this.services.list.execute(lessonId);
		return res.status(200).json({ data: versions });
	});

	get = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = requireString(req.params["versionId"], "versionId is required");
		const version = await this.services.get.execute(id);
		return res.status(200).json({ data: version });
	});

	create = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const { title, description, difficultyLevel, estimatedDurationMinutes, gradeLevelId, conceptId, pedagogyStyle } = req.body as Record<string, unknown>;

		if (!title || typeof title !== "string" || title.trim().length < 3) {
			throw new AppError("title is required (min 3 chars)", 400);
		}

		const version = await this.services.create.execute(lessonId, {
			title: title.trim(),
			description: typeof description === "string" ? description : null,
			difficultyLevel: typeof difficultyLevel === "number" ? difficultyLevel : null,
			estimatedDurationMinutes: typeof estimatedDurationMinutes === "number" ? estimatedDurationMinutes : null,
			gradeLevelId: typeof gradeLevelId === "string" ? gradeLevelId : null,
			conceptId: typeof conceptId === "string" ? conceptId : null,
			pedagogyStyle: typeof pedagogyStyle === "string" ? pedagogyStyle : null,
		});

		return res.status(201).json({ data: version });
	});

	publish = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = requireString(req.params["versionId"], "versionId is required");
		const { publish } = req.body as { publish?: boolean };

		await this.services.publish.execute(id, publish !== false);

		return res.status(200).json({ message: publish !== false ? "Version published" : "Version unpublished" });
	});
}

function requireString(value: unknown, msg: string): string {
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw new AppError(msg, 400);
}
