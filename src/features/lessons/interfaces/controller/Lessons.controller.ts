import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { RequestWithUserId } from "../../../auth/interfaces/controllers/Auth.controller";
import type { DeleteLessonUseCase } from "../../application/useCases/deleteLesson.usecase";
import type { GetLesson } from "../../application/useCases/getLesson.usecase";
import type { ListLessonsByModuleIdUseCase } from "../../application/useCases/listLessonsByModuleId.usecase";
import type { ListLessonsByModuleSlugUseCase } from "../../application/useCases/listLessonsByModuleSlug.usecase";
import type { ListLessonsUseCase } from "../../application/useCases/listLessons.usecase";
import type { PublishLessonUseCase } from "../../application/useCases/publishLesson.usecase";
import type { ReviewLessonUseCase } from "../../application/useCases/reviewLesson.usecase";
import type { UpdateLessonUseCase } from "../../application/useCases/updateLesson.usecase";
import type { CreateLessonUseCase } from "../../application/useCases/createLesson.usecase";

export class LessonController {
	constructor(
		private readonly lessonService: {
			listLessonsUseCase: ListLessonsUseCase;
			listLessonsByModuleIdUseCase: ListLessonsByModuleIdUseCase;
			listLessonsByModuleSlugUseCase: ListLessonsByModuleSlugUseCase;
			getLessonUseCase: GetLesson;
			createLessonUseCase: CreateLessonUseCase;
			updateLessonUseCase: UpdateLessonUseCase;
			deleteLessonUseCase: DeleteLessonUseCase;
			reviewLessonUseCase: ReviewLessonUseCase;
			publishLessonUseCase: PublishLessonUseCase;
		},
	) {}

	listLessons = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const moduleId = asString(req.query.moduleId);
		const moduleSlug = asString(req.query.moduleSlug);

		if (moduleId) {
			const lessons =
				await this.lessonService.listLessonsByModuleIdUseCase.execute(moduleId);

			return res.status(200).json({ data: lessons });
		}

		if (moduleSlug) {
			const lessons =
				await this.lessonService.listLessonsByModuleSlugUseCase.execute(moduleSlug);

			return res.status(200).json({ data: lessons });
		}

		const lessons = await this.lessonService.listLessonsUseCase.execute();

		return res.status(200).json({ data: lessons });
	});

	listLessonsByModuleId = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const moduleId = asString(req.params.moduleId);

			if (!moduleId) {
				return res.status(400).json({ error: "Module ID is required" });
			}

			const lessons =
				await this.lessonService.listLessonsByModuleIdUseCase.execute(moduleId);

			return res.status(200).json({ data: lessons });
		},
	);

	listLessonsByModuleSlug = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const slug = asString(req.params.slug);

			if (!slug) {
				return res.status(400).json({ error: "Module slug is required" });
			}

			const lessons =
				await this.lessonService.listLessonsByModuleSlugUseCase.execute(slug);

			return res.status(200).json({ data: lessons });
		},
	);

	getLesson = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = asString(req.params.id);

		if (!id) {
			return res.status(400).json({ error: "Lesson not found" });
		}

		const lesson = await this.lessonService.getLessonUseCase.execute(id);
		if (!lesson) {
			return res.status(404).json({ error: "Lesson not found" });
		}

		return res.status(200).json({ data: lesson });
	});

	createLesson = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const lesson = req.body;
			const authorId = req.userId;

			if (!authorId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			if (!lesson || !lesson.moduleId || !lesson.title) {
				return res
					.status(400)
					.json({ error: "moduleId and title are required" });
			}

			const lessonDTO = await this.lessonService.createLessonUseCase.execute(
				lesson,
				authorId,
			);

			return res.status(201).json({ data: lessonDTO });
		},
	);

	updateLesson = asyncHandlerMiddleware(
		async (req: RequestWithUserId, res: Response) => {
			const id = asString(req.params.id);
			const lessonPatch = req.body;

			if (!id) {
				return res.status(400).json({ error: "Lesson ID is required" });
			}

			if (!lessonPatch || Object.keys(lessonPatch).length === 0) {
				return res.status(400).json({ error: "Update payload is required" });
			}

			const lessonDTO = await this.lessonService.updateLessonUseCase.execute(
				id,
				lessonPatch,
			);

			return res.status(200).json({ data: lessonDTO });
		},
	);

	deleteLesson = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = asString(req.params.id);

		if (!id) {
			return res.status(400).json({ error: "Lesson ID is required" });
		}

		await this.lessonService.deleteLessonUseCase.execute(id);

		return res.status(204).send();
	});

	reviewLesson = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = asString(req.params.id);

		if (!id) {
			return res.status(400).json({ error: "Lesson ID is required" });
		}

		await this.lessonService.reviewLessonUseCase.execute(id);

		return res.status(200).json({ message: "Lesson reviewed" });
	});

	publishLesson = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const id = asString(req.params.id);

		if (!id) {
			return res.status(400).json({ error: "Lesson ID is required" });
		}

		await this.lessonService.publishLessonUseCase.execute(id);

		return res.status(200).json({ message: "Lesson published" });
	});
}

function asString(value: unknown) {
	if (typeof value === "string" && value.trim().length > 0) {
		return value;
	}

	return null;
}
