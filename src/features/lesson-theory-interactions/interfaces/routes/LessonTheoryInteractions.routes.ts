import { Router } from "express";
import { createLessonTheoryInteractionsController } from "../../infrastructure/factories/LessonTheoryInteractionsFactory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";

const router = Router({ mergeParams: true });
const controller = createLessonTheoryInteractionsController();

// ── Student routes (authenticated) ───────────────────────────────────────────
// GET /api/lessons/:lessonId/theory-interactions
router.get(
	"/",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getApproved),
);

// ── Teacher routes (teacher or admin role) ────────────────────────────────────
// GET /api/lessons/:lessonId/theory-interactions/all
router.get(
	"/all",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	asyncHandlerMiddleware(controller.getAll),
);

// POST /api/lessons/:lessonId/theory-interactions/:component/generate
router.post(
	"/:component/generate",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	asyncHandlerMiddleware(controller.generate),
);

// PATCH /api/lessons/:lessonId/theory-interactions/:interactionId/approve
router.patch(
	"/:interactionId/approve",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	asyncHandlerMiddleware(controller.approve),
);

// PATCH /api/lessons/:lessonId/theory-interactions/:interactionId
router.patch(
	"/:interactionId",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	asyncHandlerMiddleware(controller.update),
);

// ── Feedback routes (authenticated users) ─────────────────────────────────────
// GET  /api/lessons/:lessonId/theory-interactions/:componentId/feedback-options
router.get(
	"/:componentId/feedback-options",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getFeedbackOptions),
);

// GET  /api/lessons/:lessonId/theory-interactions/:componentId/feedback
router.get(
	"/:componentId/feedback",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getFeedback),
);

// POST /api/lessons/:lessonId/theory-interactions/:componentId/feedback
router.post(
	"/:componentId/feedback",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.upsertFeedback),
);

// DELETE /api/lessons/:lessonId/theory-interactions/:componentId/feedback
router.delete(
	"/:componentId/feedback",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.deleteFeedback),
);

export default router;
