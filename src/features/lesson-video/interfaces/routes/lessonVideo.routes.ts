import { Router } from "express";
import { useLessonVideoControllerFactory } from "../../infrastructure/factories/lessonVideoController.factory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";

const route = Router();

const { getVideo, generateVideo } = useLessonVideoControllerFactory();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

route.get("/:lessonId/video", requireAuthMiddleware, getVideo);
route.post("/:lessonId/video/generate", ...teacherOnly, generateVideo);

export default route;
