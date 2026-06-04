import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";
import { requireCreatorMiddleware } from "../../../../utils/requireCreatorMiddleware.ts";
import {
	generateLessonContent,
	generateLessonMetadata,
	improveLessonText,
	reviewLessonContent,
	generateQuizQuestions,
	generateStructuredBlocks,
} from "../controller/lessonAI.controller.ts";

const router = Router();

const teacherWithCreator = [
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	requireCreatorMiddleware,
];

// Generate a draft for a lesson field (title / description / content) from a topic
router.post("/generate", ...teacherWithCreator, generateLessonContent);

// Rewrite/improve an existing text field
router.post("/improve", ...teacherWithCreator, improveLessonText);

// Review full lesson content and return structured feedback
router.post("/review", ...teacherWithCreator, reviewLessonContent);

// Generate quiz questions from lesson content
router.post("/quiz", ...teacherWithCreator, generateQuizQuestions);

// Generate structured LessonContentNode[] blocks from a topic (for ContentLessonBlock)
router.post("/blocks", ...teacherWithCreator, generateStructuredBlocks);

// Suggest description + durationMinutes from a lesson title and module name
router.post("/metadata", ...teacherWithCreator, generateLessonMetadata);

export default router;
