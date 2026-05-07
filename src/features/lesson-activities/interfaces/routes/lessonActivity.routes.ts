import { Router } from "express";
import { validateInput } from "../../../../utils/validateInputMiddleware.ts";
import { CreateLessonActivitySchema } from "../../application/dto/LessonActivity.dto.ts";
import { useLessonActivityControllerFactory } from "../../infrastructure/factories/lessonActivityController.factory.ts";

const route = Router();

const { create, findOne, findByLesson, remove, reorder } =
	useLessonActivityControllerFactory();

route.get("/lesson/:lessonId", findByLesson);
route.get("/:id", findOne);
route.post("/", validateInput(CreateLessonActivitySchema), create);
route.delete("/:id", remove);
route.patch("/:id/reorder", reorder);

export default route;
