import type { Request, Response } from "express";
import type { GetBlockExplanationsUseCase } from "../../application/useCases/GetBlockExplanationsUseCase.ts";
import type { GetExplanationByLevelUseCase } from "../../application/useCases/GetExplanationByLevelUseCase.ts";
import type { UpsertTeacherExplanationUseCase } from "../../application/useCases/UpsertTeacherExplanationUseCase.ts";
import type { GenerateExplanationForTeacherUseCase } from "../../application/useCases/GenerateExplanationForTeacherUseCase.ts";
import { EXPLANATION_LEVELS } from "../../domain/types/TheoryLevelExplanation.type.ts";
import type { ExplanationLevel } from "../../domain/types/TheoryLevelExplanation.type.ts";
import { checkIsPro } from "../../../../utils/checkIsPro.ts";
import { supabase } from "../../../../core/db/supabaseClient.ts";

async function fetchBlockContext(
	lessonId: string,
	blockId: string,
): Promise<{ theoryContent: string; lessonTitle: string } | null> {
	const [blockResult, lessonResult] = await Promise.all([
		supabase.from("lesson_blocks").select("data").eq("id", blockId).eq("lesson_id", lessonId).maybeSingle(),
		supabase.from("lessons").select("title").eq("id", lessonId).maybeSingle(),
	]);

	if (blockResult.error || lessonResult.error) return null;
	if (!blockResult.data || !lessonResult.data) return null;

	return {
		theoryContent: JSON.stringify(blockResult.data.data),
		lessonTitle: (lessonResult.data as { title: string }).title,
	};
}

function parseLevel(raw: string): ExplanationLevel | null {
	return EXPLANATION_LEVELS.includes(raw as ExplanationLevel) ? (raw as ExplanationLevel) : null;
}

export class TheoryLevelExplanationController {
	constructor(
		private readonly getBlockExplanations: GetBlockExplanationsUseCase,
		private readonly getExplanationByLevel: GetExplanationByLevelUseCase,
		private readonly upsertTeacherExplanation: UpsertTeacherExplanationUseCase,
		private readonly generateForTeacher: GenerateExplanationForTeacherUseCase,
	) {}

	/** GET /api/lessons/:lessonId/blocks/:blockId/explanations */
	listAll = async (req: Request, res: Response): Promise<void> => {
		const blockId = req.params["blockId"] as string;
		const explanations = await this.getBlockExplanations.execute(blockId);
		res.json({ data: explanations });
	};

	/** GET /api/lessons/:lessonId/blocks/:blockId/explanations/:level */
	getByLevel = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const blockId = req.params["blockId"] as string;
		const level = parseLevel(req.params["level"] as string);

		if (!level) {
			res.status(400).json({ error: `Invalid level. Must be one of: ${EXPLANATION_LEVELS.join(", ")}` });
			return;
		}

		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const isPro = await checkIsPro(userId);

		const ctx = await fetchBlockContext(lessonId, blockId);
		if (!ctx) {
			res.status(404).json({ error: "Block or lesson not found" });
			return;
		}

		const explanation = await this.getExplanationByLevel.execute({
			lessonBlockId: blockId,
			level,
			isPro,
			theoryContent: ctx.theoryContent,
			lessonTitle: ctx.lessonTitle,
		});

		if (!explanation) {
			res.status(204).end();
			return;
		}

		res.json({ data: explanation });
	};

	/** PUT /api/lessons/:lessonId/blocks/:blockId/explanations/:level */
	upsertTeacher = async (req: Request, res: Response): Promise<void> => {
		const blockId = req.params["blockId"] as string;
		const level = parseLevel(req.params["level"] as string);

		if (!level) {
			res.status(400).json({ error: `Invalid level. Must be one of: ${EXPLANATION_LEVELS.join(", ")}` });
			return;
		}

		const { content } = req.body as { content?: string };
		if (!content || typeof content !== "string" || content.trim().length === 0) {
			res.status(400).json({ error: "content is required" });
			return;
		}

		const explanation = await this.upsertTeacherExplanation.execute(blockId, level, content);
		res.json({ data: explanation });
	};

	/** POST /api/lessons/:lessonId/blocks/:blockId/explanations/:level/generate */
	generate = async (req: Request, res: Response): Promise<void> => {
		const lessonId = req.params["lessonId"] as string;
		const blockId = req.params["blockId"] as string;
		const level = parseLevel(req.params["level"] as string);

		if (!level) {
			res.status(400).json({ error: `Invalid level. Must be one of: ${EXPLANATION_LEVELS.join(", ")}` });
			return;
		}

		const ctx = await fetchBlockContext(lessonId, blockId);
		if (!ctx) {
			res.status(404).json({ error: "Block or lesson not found" });
			return;
		}

		const explanation = await this.generateForTeacher.execute(
			blockId,
			level,
			ctx.theoryContent,
			ctx.lessonTitle,
		);

		res.json({ data: explanation });
	};
}
