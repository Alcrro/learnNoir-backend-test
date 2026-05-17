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

// GET /api/lessons/:lessonId/theory-interactions/my-attempts
// Must be registered before /:componentId routes to avoid matching "my-attempts" as a param
router.get(
	"/my-attempts",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getUserAttempts),
);

// GET /api/lessons/:lessonId/theory-interactions/my-progress
// Returns component types the user has completed via the engage flow.
router.get(
	"/my-progress",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getMyProgress),
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

// ── Student engagement route ───────────────────────────────────────────────────
// POST /api/lessons/:lessonId/theory-interactions/engage
// Records that the student engaged with a theory component; creates the activity lazily.
// Works even when no teacher-approved interaction exists for the component.
router.post(
	"/engage",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.engageComponent),
);

// ── Student attempt routes ─────────────────────────────────────────────────────
// POST /api/lessons/:lessonId/theory-interactions/:interactionId/attempt
router.post(
	"/:interactionId/attempt",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.recordAttempt),
);

export default router;
