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
	createLesson,
	updateLesson,
	deleteLesson,
	reviewLesson,
	publishLesson,
} = lessonControllerFactory();

router.get("", listLessons);
router.get("/module/id/:moduleId", listLessonsByModuleId);
router.get("/module/slug/:slug", listLessonsByModuleSlug);
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
