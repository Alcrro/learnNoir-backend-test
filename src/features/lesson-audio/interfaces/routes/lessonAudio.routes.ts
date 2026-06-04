import { Router } from "express";
import { useLessonAudioControllerFactory } from "../../infrastructure/factories/lessonAudioController.factory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";
import { requireCreatorMiddleware } from "../../../../utils/requireCreatorMiddleware.ts";

const route = Router();

const { getAudio, generateAudio } = useLessonAudioControllerFactory();

route.get("/:lessonId/audio", requireAuthMiddleware, getAudio);
route.post(
	"/:lessonId/audio/generate",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	requireCreatorMiddleware,
	generateAudio,
);

export default route;
