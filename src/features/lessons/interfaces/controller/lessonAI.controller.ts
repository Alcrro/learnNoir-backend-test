import type { Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import type { RequestWithUserId } from "../../../auth/interfaces/controllers/Auth.controller.ts";
import { LessonAIService } from "../../infrastructure/ai/lessonAI.service.ts";
import { CacheService } from "../../infrastructure/cache/cache.service.ts";
import { redis } from "../../../../core/cache/redis.ts";

const ai = new LessonAIService(new CacheService(redis));

export const generateLessonContent = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { topic, field } = req.body as { topic?: string; field?: string };

		if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
			return res.status(400).json({ error: "topic is required" });
		}

		const validFields = ["title", "description", "content"] as const;
		const resolvedField = validFields.includes(
			field as (typeof validFields)[number],
		)
			? (field as (typeof validFields)[number])
			: "content";

		const result = await ai.generateContent(topic.trim(), resolvedField);
		return res.status(200).json({ data: result });
	},
);

export const improveLessonText = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { text, context } = req.body as { text?: string; context?: string };

		if (!text || typeof text !== "string" || text.trim().length < 10) {
			return res.status(400).json({ error: "text is required (min 10 chars)" });
		}

		const result = await ai.improveText(text.trim(), context?.trim());
		return res.status(200).json({ data: result });
	},
);

export const reviewLessonContent = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { title, description, content } = req.body as {
			title?: string;
			description?: string;
			content?: string;
		};

		if (!title || !content) {
			return res.status(400).json({ error: "title and content are required" });
		}

		const result = await ai.reviewLesson({
			title: title.trim(),
			description: description?.trim() ?? "",
			content: content.trim(),
		});
		return res.status(200).json({ data: result });
	},
);

export const generateQuizQuestions = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { content, count } = req.body as { content?: string; count?: number };

		if (!content || typeof content !== "string" || content.trim().length < 20) {
			return res.status(400).json({ error: "content is required (min 20 chars)" });
		}

		const resolvedCount =
			typeof count === "number" && count > 0 && count <= 10 ? count : 3;
		const result = await ai.generateQuizQuestions(content.trim(), resolvedCount);
		return res.status(200).json({ data: result });
	},
);

export const generateLessonMetadata = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { title, moduleName } = req.body as {
			title?: string;
			moduleName?: string;
		};

		if (!title || typeof title !== "string" || title.trim().length < 3) {
			return res.status(400).json({ error: "title is required (min 3 chars)" });
		}

		const result = await ai.generateMetadata(
			title.trim(),
			(moduleName ?? "General").trim(),
		);
		return res.status(200).json({ data: result });
	},
);

// Returns a structured LessonContentNode[] ready to store as ContentLessonBlock.data.content
export const generateStructuredBlocks = asyncHandlerMiddleware(
	async (req: RequestWithUserId, res: Response) => {
		const { topic } = req.body as { topic?: string };

		if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
			return res.status(400).json({ error: "topic is required" });
		}

		const result = await ai.generateStructuredBlocks(topic.trim());
		return res.status(200).json({ data: result });
	},
);
