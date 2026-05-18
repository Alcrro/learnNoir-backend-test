import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { lessonControllerFactory } from "../../infrastructure/factories/lessonControllerFactory";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import {
	CreateLessonSchema,
	UpdateLessonSchema,
	GenerateBlocksSchema,
} from "../../application/dto/lesson.schema";

const router = Router();

const {
	listLessons,
	listLessonsByModuleId,
	listLessonsByModuleSlug,
	getLesson,
	getLessonBySlug,
	createLesson,
	updateLesson,
	deleteLesson,
	reviewLesson,
	publishLesson,
	listTeacherLessons,
	getTeacherStats,
	getTeacherStudents,
	getLessonHistory,
	generateBlocksFromText,
} = lessonControllerFactory();

router.get("", listLessons);
router.get("/module/id/:moduleId", listLessonsByModuleId);
router.get("/module/slug/:slug", listLessonsByModuleSlug);
// Must be before /:id to avoid route conflict — resolves lesson by URL slug
router.get("/slug/:slug", getLessonBySlug);

// Teacher-only dashboard endpoints — before /:id to avoid route conflict
router.get(
	"/mine",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	listTeacherLessons,
);
router.get(
	"/mine/stats",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	getTeacherStats,
);
router.get(
	"/mine/students",
	requireAuthMiddleware,
	roleRequiredMiddleware(["teacher", "admin"]),
	getTeacherStudents,
);

router.get("/:id", getLesson);
router.post(
	"",
	requireAuthMiddleware,
	roleRequiredMiddleware(["admin", "teacher"]),
	validateInput(CreateLessonSchema),
	createLesson,
);
router.get("/:id/history", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), getLessonHistory);
router.put("/:id", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), validateInput(UpdateLessonSchema), updateLesson);
router.delete("/:id", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), deleteLesson);
router.patch("/:id/review", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), reviewLesson);
router.patch("/:id/publish", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), publishLesson);
router.post("/:id/generate-blocks", requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"]), validateInput(GenerateBlocksSchema), generateBlocksFromText);

export default router;
