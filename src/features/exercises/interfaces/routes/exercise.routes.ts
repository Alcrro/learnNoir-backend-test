import { Router } from "express";
import { createExerciseController } from "../../infrastructure/factories/ExerciseFactory.ts";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { requireProMiddleware } from "../../../../utils/requireProMiddleware.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";

// Router for lesson-scoped routes: /api/lessons/:lessonId/exercises
export const lessonExercisesRouter = Router({ mergeParams: true });
const controller = createExerciseController();

// GET /api/lessons/:lessonId/exercises/preview — public, free tier (first 2 exercises)
// Must be registered before / and /my-progress to avoid conflicts
lessonExercisesRouter.get(
	"/preview",
	asyncHandlerMiddleware(controller.getPreviewByLesson),
);

// GET /api/lessons/:lessonId/exercises/my-progress
lessonExercisesRouter.get(
	"/my-progress",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.getMyProgress),
);

// GET /api/lessons/:lessonId/exercises — requires pro subscription
lessonExercisesRouter.get(
	"/",
	requireAuthMiddleware,
	requireProMiddleware,
	asyncHandlerMiddleware(controller.getByLesson),
);

// Router for exercise-scoped routes: /api/exercises/:exerciseId/...
export const exercisesRouter = Router({ mergeParams: true });

// POST /api/exercises/:exerciseId/run
exercisesRouter.post(
	"/:exerciseId/run",
	asyncHandlerMiddleware(controller.runCode),
);

// POST /api/exercises/:exerciseId/submit
exercisesRouter.post(
	"/:exerciseId/submit",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.submitExercise),
);
