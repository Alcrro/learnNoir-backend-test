import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import type { TranslateLessonUseCase } from "../../application/useCases/TranslateLessonUseCase.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";

export class LessonTranslationController {
	constructor(private readonly translateLesson: TranslateLessonUseCase) {}

	translate = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const lessonId = req.params["lessonId"] as string;
		const { lang } = req.body as { lang: string };

		if (!lessonId) throw new AppError("lessonId is required", 400);

		const translation = await this.translateLesson.execute(lessonId, lang);
		res.status(200).json({ data: translation });
	});
}
