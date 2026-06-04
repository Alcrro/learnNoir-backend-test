import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { progressControllerFactory } from "../../infrastructure/factories/progressControllerFactory";

const router = Router();

const { getLessonProgress, getUserProgress, upsertLessonProgress, getQuizBlockScores, upsertQuizBlockScore, getDueForReview } = progressControllerFactory();

// All progress endpoints require an authenticated user — progress is personal data.
router.get("/me", requireAuthMiddleware, getUserProgress);
router.get("/due-for-review", requireAuthMiddleware, getDueForReview);
router.get("/lesson/:lessonId", requireAuthMiddleware, getLessonProgress);
router.patch("/lesson/:lessonId", requireAuthMiddleware, upsertLessonProgress);
router.get("/lesson/:lessonId/quiz-blocks", requireAuthMiddleware, getQuizBlockScores);
router.post("/lesson/:lessonId/quiz-block/:blockId", requireAuthMiddleware, upsertQuizBlockScore);

export default router;
