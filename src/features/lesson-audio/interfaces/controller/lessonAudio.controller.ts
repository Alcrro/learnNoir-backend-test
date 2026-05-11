import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";
import type { GetLessonAudioUseCase } from "../../application/useCases/getLessonAudioUseCase.ts";
import type { GenerateLessonAudioUseCase } from "../../application/useCases/generateLessonAudioUseCase.ts";

export class LessonAudioController {
	constructor(
		private readonly services: {
			getAudio: GetLessonAudioUseCase;
			generateAudio: GenerateLessonAudioUseCase;
		},
	) {}

	getAudio = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const audio = await this.services.getAudio.execute(lessonId);

		if (!audio) {
			return res.status(404).json({ success: false, message: "No audio generated yet" });
		}

		return res.status(200).json({ success: true, data: audio });
	});

	generateAudio = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = requireString(req.params["lessonId"], "lessonId is required");
		const audio = await this.services.generateAudio.execute(lessonId);
		return res.status(201).json({ success: true, data: audio });
	});
}

function requireString(value: unknown, msg: string): string {
	if (typeof value === "string" && value.trim().length > 0) return value;
	throw new AppError(msg, 400);
}
