import { Router } from "express";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { CreateLessonBlockSchema } from "../../application/dto/LessonBlock.dto";
import { useLessonBlockControllerFactory } from "../../infrastructure/factories/lessonBlockController.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware";

const route = Router();

const { findOne, findByLessonId, createLessonBlock, updateContent } = useLessonBlockControllerFactory();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

// Must be before /:id to avoid the route param swallowing "lesson"
route.get("/lesson/:lessonId", findByLessonId);
route.get("/:id", findOne);
route.post("/", validateInput(CreateLessonBlockSchema), createLessonBlock);
route.patch("/:id/content", ...teacherOnly, updateContent);

export default route;
