import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { progressControllerFactory } from "../../infrastructure/factories/progressControllerFactory";

const router = Router();

const { getLessonProgress, getUserProgress, upsertLessonProgress } = progressControllerFactory();

// All progress endpoints require an authenticated user — progress is personal data.
router.get("/me", requireAuthMiddleware, getUserProgress);
router.get("/lesson/:lessonId", requireAuthMiddleware, getLessonProgress);
router.patch("/lesson/:lessonId", requireAuthMiddleware, upsertLessonProgress);

export default router;
