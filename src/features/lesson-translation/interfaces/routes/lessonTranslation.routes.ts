import { Router } from "express";
import { z } from "zod";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { validateInput } from "../../../../utils/validateInputMiddleware.ts";
import { createLessonTranslationController } from "../../infrastructure/factories/LessonTranslationFactory.ts";

const router = Router({ mergeParams: true });
const controller = createLessonTranslationController();

const TranslateBodySchema = z.object({
	lang: z.string().min(2).max(10),
});

// POST /api/lessons/:lessonId/translate
router.post("/", requireAuthMiddleware, validateInput(TranslateBodySchema), controller.translate);

export default router;
