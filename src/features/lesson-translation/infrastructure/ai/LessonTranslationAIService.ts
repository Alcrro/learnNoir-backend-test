import OpenAI from "openai";
import type { LessonBlock, LessonTranslation, TranslatedBlockPayload, TranslatedContentNode, TranslatedQuizQuestion } from "@shared/index.ts";
import { env } from "../../../../config/env.ts";
import { redis } from "../../../../core/cache/redis.ts";
import { lessonTranslationPolicy } from "../../../../policy/promptPolicies.ts";
import type { ILessonTranslationAIService } from "../../application/useCases/TranslateLessonUseCase.ts";
import { AppError } from "../../../../utils/errors/AppError.ts";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

export class LessonTranslationAIService implements ILessonTranslationAIService {
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	async translate(
		lessonId: string,
		lang: string,
		title: string,
		description: string | null,
		blocks: LessonBlock[],
		updatedAt: Date,
	): Promise<LessonTranslation> {
		const contentVersion = updatedAt.getTime().toString(36);
		const cacheKey = `translation:v2:${lessonId}:${lang}:${contentVersion}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			const parsed = JSON.parse(cached) as LessonTranslation;
			// Reject stale cache entries that have the old schema (id/data.content instead of blockId/nodes)
			if (parsed.blocks[0] == null || "blockId" in parsed.blocks[0]) {
				return parsed;
			}
			await redis.del(cacheKey);
		}

		const response = await this.openai.chat.completions.create({
			model: "gpt-4.1-mini",
			max_completion_tokens: 16384,
			messages: [
				{ role: "system", content: lessonTranslationPolicy.systemPrompt },
				{
					role: "user",
					content: `Translate to language: ${lang} (BCP-47).\n\n${JSON.stringify({ title, description, blocks })}`,
				},
			],
		});

		const raw = (response.choices[0]?.message?.content ?? "")
			.replace(/^```(?:json)?\s*/i, "")
			.replace(/\s*```$/, "")
			.trim();

		if (!lessonTranslationPolicy.validateOutput?.(raw)) {
			console.error("[translation] finish_reason:", response.choices[0]?.finish_reason);
			console.error("[translation] raw (first 500):", raw.slice(0, 500));
			throw new AppError("AI returned invalid JSON for translation", 502);
		}

		const rawOutput = JSON.parse(raw) as { title?: string; description?: string; blocks?: LessonBlock[] } | LessonBlock[];
		const rawBlocks: LessonBlock[] = Array.isArray(rawOutput) ? rawOutput : (rawOutput.blocks ?? []);
		const translatedTitle = Array.isArray(rawOutput) ? undefined : rawOutput.title;
		const translatedDescription = Array.isArray(rawOutput) ? undefined : rawOutput.description;

		const translatedBlocks: TranslatedBlockPayload[] = rawBlocks.map((b): TranslatedBlockPayload => {
			if (b.type === "content") {
				return {
					blockId: b.id,
					type: "content",
					nodes: b.data.content as TranslatedContentNode[],
				};
			}
			if (b.type === "assessment") {
				const rawQs = (b.data as Record<string, unknown>)["questions"];
				if (Array.isArray(rawQs)) {
					const questions: TranslatedQuizQuestion[] = rawQs.map((q) => {
						const qObj = q as Record<string, unknown>;
						const text = qObj["question"] ?? qObj["sentence"] ?? "";
						const rawOptions = Array.isArray(qObj["options"]) ? qObj["options"] : [];
						return {
							question: String(text),
							options: rawOptions.map((o: unknown) =>
								typeof o === "string" ? { text: o } : (o as { text: string; explanation?: string }),
							),
							...(qObj["hint"] != null ? { hint: String(qObj["hint"]) } : {}),
						};
					});
					return { blockId: b.id, type: "assessment", questions };
				}
				return { blockId: b.id, type: "assessment" };
			}
			return { blockId: b.id, type: b.type };
		});

		const translation: LessonTranslation = {
			lessonId,
			lang,
			...(translatedTitle ? { title: translatedTitle } : {}),
			...(translatedDescription ? { description: translatedDescription } : {}),
			blocks: translatedBlocks,
		};

		await redis.set(cacheKey, JSON.stringify(translation), "EX", CACHE_TTL_SECONDS);

		return translation;
	}
}
