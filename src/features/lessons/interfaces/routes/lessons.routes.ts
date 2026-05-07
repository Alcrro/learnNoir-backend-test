import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { lessonControllerFactory } from "../../infrastructure/factories/lessonControllerFactory";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware";

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
	createLesson,
);
router.put("/:id", requireAuthMiddleware, updateLesson);
router.delete("/:id", requireAuthMiddleware, deleteLesson);
router.patch("/:id/review", requireAuthMiddleware, reviewLesson);
router.patch("/:id/publish", requireAuthMiddleware, publishLesson);

export default router;
