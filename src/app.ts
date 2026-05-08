import express from "express";
import cors from "cors";
import openaiRoutes from "./features/lessons/interfaces/routes/openai.routes";
import lessonsRoutes from "./features/lessons/interfaces/routes/lessons.routes";
import lessonsBlockRoutes from "./features/lessons-block/interfaces/routes/lessonBlock.routes";
import lessonActivitiesRoutes from "./features/lesson-activities/interfaces/routes/lessonActivity.routes";
import authRoutes from "./features/auth/interfaces/routes/auth.routes";
import profilesRoutes from "./features/profiles/interfaces/routes/Profiles.routes";
import modulesRoutes from "./features/modules/interfaces/http/routes/ModulesRouter.routes";
import subjectsRoutes from "./features/subjects/interfaces/routes/SubjectsRoute.routes";
import categoriesRoutes from "./features/categories/interfaces/routes/http/CategoriesRouter.route";
import progressRoutes from "./features/progress/interfaces/routes/progress.routes";
import { errorHandler, notFoundHandler } from "./utils/errors/errorMiddleware";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
	cors({
		origin: process.env["ALLOWED_ORIGIN"] ?? "http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.json());
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
				styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
				imgSrc: ["'self'", "data:"],
				connectSrc: ["'self'", "https://api.openai.com"],
			},
		},
	}),
);
app.use("/api/openai", openaiRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/lessons-block", lessonsBlockRoutes);
app.use("/api/lesson-activities", lessonActivitiesRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/auth/confirmation", (req, res) => {
	res.send("Email confirmation endpoint");
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
