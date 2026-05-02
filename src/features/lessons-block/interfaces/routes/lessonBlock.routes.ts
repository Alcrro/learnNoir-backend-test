import { Router } from "express";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { CreateLessonBlockSchema } from "../../application/dto/LessonBlock.dto";
import { useLessonBlockControllerFactory } from "../../infrastructure/factories/lessonBlockController.factory";

const route = Router();

const { findOne, createLessonBlock } = useLessonBlockControllerFactory();

route.get("/:id", findOne);
route.post("/", createLessonBlock);

export default route;
