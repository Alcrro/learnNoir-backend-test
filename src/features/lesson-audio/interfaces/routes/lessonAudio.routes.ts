import { Router } from "express";
import { useLessonAudioControllerFactory } from "../../infrastructure/factories/lessonAudioController.factory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";

const route = Router();

const { getAudio, generateAudio } = useLessonAudioControllerFactory();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

route.get("/:lessonId/audio", requireAuthMiddleware, getAudio);
route.post("/:lessonId/audio/generate", ...teacherOnly, generateAudio);

export default route;
