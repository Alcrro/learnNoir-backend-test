// Core framework and security middleware
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

// Feature route modules
import lessonAIRoutes from "./features/lessons/interfaces/routes/lessonAI.routes";
import lessonsRoutes from "./features/lessons/interfaces/routes/lessons.routes";
import lessonsBlockRoutes from "./features/lessons-block/interfaces/routes/lessonBlock.routes";
import lessonActivitiesRoutes from "./features/lesson-activities/interfaces/routes/lessonActivity.routes";
import authRoutes from "./features/auth/interfaces/routes/auth.routes";
import profilesRoutes from "./features/profiles/interfaces/routes/Profiles.routes";
import modulesRoutes from "./features/modules/interfaces/http/routes/ModulesRouter.routes";
import subjectsRoutes from "./features/subjects/interfaces/routes/SubjectsRoute.routes";
import categoriesRoutes from "./features/categories/interfaces/routes/http/CategoriesRouter.route";
import progressRoutes from "./features/progress/interfaces/routes/progress.routes";
import lessonAudioRoutes from "./features/lesson-audio/interfaces/routes/lessonAudio.routes";
import lessonVideoRoutes from "./features/lesson-video/interfaces/routes/lessonVideo.routes";
import lessonVersionsRoutes from "./features/lesson-versions/interfaces/routes/lessonVersion.routes";
import lessonTheoryInteractionsRoutes from "./features/lesson-theory-interactions/interfaces/routes/LessonTheoryInteractions.routes";
import theoryLevelRoutes from "./features/lesson-theory-levels/interfaces/routes/TheoryLevelExplanation.routes";
import lessonTranslationRoutes from "./features/lesson-translation/interfaces/routes/lessonTranslation.routes";
import { lessonExercisesRouter, exercisesRouter } from "./features/exercises/interfaces/routes/exercise.routes";
import subscriptionsRoutes from "./features/subscriptions/interfaces/routes/subscriptions.routes";
import organizationsRoutes from "./features/organizations/interfaces/routes/organizations.routes";

// Global error and 404 handlers
import { errorHandler, notFoundHandler } from "./utils/errors/errorMiddleware";
import { setupExpressErrorHandler } from "@sentry/node";

// Central env config — all process.env access goes through here
import { env } from "./config/env";

const app = express();

// Trust one proxy hop so express-rate-limit can read the real client IP from X-Forwarded-For
app.set("trust proxy", 1);

// ── Security middleware ────────────────────────────────────────────────────────
// Helmet sets defensive HTTP headers (XSS, clickjacking, sniffing) — must run first
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // Block all external resources by default
				scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow scripts only from self + jsdelivr
				styleSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow styles only from self + jsdelivr
				imgSrc: ["'self'", "data:"], // Allow images from self and inline data URIs
				connectSrc: ["'self'", "https://api.openai.com"], // Allow fetch/XHR to self and OpenAI API
			},
		},
	}),
);

// Enable CORS so browser clients can make cross-origin requests to this API
app.use(
	cors({
		origin: env.CORS_ORIGIN, // Driven by env — no hardcoded URLs in source
		credentials: true, // Required to forward the httpOnly accessToken cookie
	}),
);

// ── Request parsing ────────────────────────────────────────────────────────────
// Parse cookies from incoming requests — needed to read the accessToken auth cookie
app.use(cookieParser());

// Parse JSON bodies and expose them as req.body on POST/PUT/PATCH requests
app.use(express.json());

// ── Health check (ECS / load balancer) ────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Feature routes ─────────────────────────────────────────────────────────────
app.use("/api/lessons/ai", lessonAIRoutes); // AI assistant for lesson editing (teacher-only)
app.use("/api/lessons", lessonsRoutes); // Lesson CRUD
app.use("/api/lessons-block", lessonsBlockRoutes); // Lesson block content (content / interactive / assessment)
app.use("/api/lesson-activities", lessonActivitiesRoutes); // Per-user lesson activity tracking
app.use("/api/modules", modulesRoutes); // Course modules grouping lessons
app.use("/api/subjects", subjectsRoutes); // Top-level subjects (Computer Science, Math…)
app.use("/api/categories", categoriesRoutes); // Categories for organising content
app.use("/api/progress", progressRoutes); // User learning progress
app.use("/api/lessons", lessonAudioRoutes); // Lesson audio narration (Watch tab)
app.use("/api/lessons", lessonVideoRoutes); // Lesson video (AI-generated, provider TBD)
app.use("/api/lessons/:lessonId/versions", lessonVersionsRoutes); // Lesson version history
app.use(
	"/api/lessons/:lessonId/theory-interactions",
	lessonTheoryInteractionsRoutes,
); // Theory interaction components (V2 learning layout)
app.use("/api/lessons/:lessonId/exercises", lessonExercisesRouter); // Coding exercises (LeetCode-style) per lesson
app.use("/api/lessons/:lessonId/blocks/:blockId/explanations", theoryLevelRoutes); // Theory level explanations (Explică-mi altfel)
app.use("/api/lessons/:lessonId/translate", lessonTranslationRoutes); // AI-powered lesson content translation
app.use("/api/exercises", exercisesRouter); // Exercise run/submit endpoints
app.use("/api/auth", authRoutes); // Login, register, token refresh, logout
app.use("/api/profiles", profilesRoutes); // User profile management
app.use("/api/subscriptions", subscriptionsRoutes); // Subscription plan management
app.use("/api/organizations", organizationsRoutes); // Organization management and org-level subscriptions

// ── Global error handling (must be registered last) ───────────────────────────
// Return a 404 JSON response for any route that didn't match above
app.use(notFoundHandler);

// Capture thrown errors in Sentry before our formatter runs (no-op if DSN not set)
setupExpressErrorHandler(app);

// Catch errors thrown by any route handler and return a structured error response
app.use(errorHandler);

export default app;
