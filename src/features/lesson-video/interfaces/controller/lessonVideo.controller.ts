import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";
import type { GetLessonVideoUseCase } from "../../application/useCases/getLessonVideoUseCase.ts";
import type { GenerateLessonVideoUseCase } from "../../application/useCases/generateLessonVideoUseCase.ts";

export class LessonVideoController {
	constructor(
		private readonly services: {
			getVideo: GetLessonVideoUseCase;
			generateVideo: GenerateLessonVideoUseCase;
		},
	) {}

	getVideo = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const video = await this.services.getVideo.execute(lessonId);

		if (!video) {
			return res.status(404).json({ error: "No video generated yet" });
		}

		return res.status(200).json({ data: video });
	});

	generateVideo = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const video = await this.services.generateVideo.execute(lessonId);
		return res.status(201).json({ data: video });
	});
}

function requireString(value: unknown, msg: string): string {
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw new AppError(msg, 400);
}
