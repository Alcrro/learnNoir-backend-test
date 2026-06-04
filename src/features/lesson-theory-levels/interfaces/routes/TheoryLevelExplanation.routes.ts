import { Router } from "express";
import { createTheoryLevelController } from "../../infrastructure/factories/TheoryLevelFactory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";
import { requireCreatorMiddleware } from "../../../../utils/requireCreatorMiddleware.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";

const router = Router({ mergeParams: true });
const controller = createTheoryLevelController();

// GET /api/lessons/:lessonId/blocks/:blockId/explanations
router.get(
	"/",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.listAll),
);

// GET /api/lessons/:lessonId/blocks/:blockId/explanations/:level
router.get(
	"/:level",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getByLevel),
);

// PUT /api/lessons/:lessonId/blocks/:blockId/explanations/:level
router.put(
	"/:level",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	asyncHandlerMiddleware(controller.upsertTeacher),
);

// POST /api/lessons/:lessonId/blocks/:blockId/explanations/:level/generate
router.post(
	"/:level/generate",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	requireCreatorMiddleware,
	asyncHandlerMiddleware(controller.generate),
);

export default router;
