import { Router } from "express";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { CreateLessonBlockSchema } from "../../application/dto/LessonBlock.dto";
import { useLessonBlockControllerFactory } from "../../infrastructure/factories/lessonBlockController.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware";

const route = Router();

const { findOne, findByLessonId, findPreviewByLessonId, createLessonBlock, updateContent, updateBlockData } =
	useLessonBlockControllerFactory();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

// /preview must be registered before /lesson/:lessonId to avoid param conflicts
route.get("/lesson/:lessonId/preview", findPreviewByLessonId);
route.get("/lesson/:lessonId", findByLessonId);
route.get("/:id", findOne);
route.post("/", validateInput(CreateLessonBlockSchema), createLessonBlock);
route.patch("/:id/content", ...teacherOnly, updateContent);
route.patch("/:id/data", ...teacherOnly, updateBlockData);

export default route;
