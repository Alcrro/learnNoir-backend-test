import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";
import {
	generateLessonContent,
	generateLessonMetadata,
	improveLessonText,
	reviewLessonContent,
	generateQuizQuestions,
	generateStructuredBlocks,
} from "../controller/lessonAI.controller.ts";

const router = Router();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

// Generate a draft for a lesson field (title / description / content) from a topic
router.post("/generate", ...teacherOnly, generateLessonContent);

// Rewrite/improve an existing text field
router.post("/improve", ...teacherOnly, improveLessonText);

// Review full lesson content and return structured feedback
router.post("/review", ...teacherOnly, reviewLessonContent);

// Generate quiz questions from lesson content
router.post("/quiz", ...teacherOnly, generateQuizQuestions);

// Generate structured LessonContentNode[] blocks from a topic (for ContentLessonBlock)
router.post("/blocks", ...teacherOnly, generateStructuredBlocks);

// Suggest description + durationMinutes from a lesson title and module name
router.post("/metadata", ...teacherOnly, generateLessonMetadata);

export default router;
