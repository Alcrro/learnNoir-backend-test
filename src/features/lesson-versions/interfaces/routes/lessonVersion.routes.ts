import { Router } from "express";
import { lessonVersionControllerFactory } from "../../infrastructure/factories/lessonVersionController.factory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { roleRequiredMiddleware } from "../../../../utils/roleRequiredMiddleware.ts";

const router = Router({ mergeParams: true });

const { list, get, create, publish } = lessonVersionControllerFactory();

const teacherOnly = [requireAuthMiddleware, roleRequiredMiddleware(["teacher", "admin"])];

router.get("/", requireAuthMiddleware, list);
router.get("/:versionId", requireAuthMiddleware, get);
router.post("/", ...teacherOnly, create);
router.patch("/:versionId/publish", ...teacherOnly, publish);

export default router;
