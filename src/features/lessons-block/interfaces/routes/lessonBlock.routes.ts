import { Router } from "express";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { CreateLessonBlockSchema } from "../../application/dto/LessonBlock.dto";
import { useLessonBlockControllerFactory } from "../../infrastructure/factories/lessonBlockController.factory";

const route = Router();

const { findOne, findByLessonId, createLessonBlock } = useLessonBlockControllerFactory();

// Must be before /:id to avoid the route param swallowing "lesson"
route.get("/lesson/:lessonId", findByLessonId);
route.get("/:id", findOne);
route.post("/", validateInput(CreateLessonBlockSchema), createLessonBlock);

export default route;
