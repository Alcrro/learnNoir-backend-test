import type { LessonVideoRepository } from "../../domain/repositories/LessonVideoRepository.ts";
import type { LessonVideo } from "../../domain/types/lessonVideo.types.ts";
import type { ILessonVideoProvider } from "../../infrastructure/ai/LessonVideoAIService.ts";
import type { LessonBlockRepository } from "../../../lessons-block/domain/repositories/LessonBlockRepository.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";

export class GenerateLessonVideoUseCase {
	constructor(
		private readonly videoRepo: LessonVideoRepository,
		private readonly blockRepo: LessonBlockRepository,
		private readonly provider: ILessonVideoProvider,
		private readonly providerName: string,
	) {}

	async execute(lessonId: string): Promise<LessonVideo> {
		const blocks = await this.blockRepo.findByLessonId(lessonId);
		const contentBlocks = blocks.filter((b) => b.type === "content");

		if (contentBlocks.length === 0) {
			throw new NotFoundError("No content blocks found for this lesson");
		}

		const script = contentBlocks.flatMap((b) => {
			const data = b.toPrimitives();
			if (data.type !== "content") return [];
			const nodes = (data.data.content ?? []) as Record<string, unknown>[];
			return nodes.map((node) => ({
				text: extractNodeText(node),
				start_ms: 0,
				end_ms: 0,
			})).filter((s) => s.text.length > 0);
		});

		if (script.length === 0) {
			throw new NotFoundError("No text content found for video generation");
		}

		const videoUrl = await this.provider.generateVideo(script, lessonId);

		return this.videoRepo.upsert({
			lessonId,
			script,
			videoUrl,
			provider: this.providerName,
		});
	}
}

function extractNodeText(node: Record<string, unknown>): string {
	if (typeof node["title"] === "string") return node["title"];
	if (typeof node["statement"] === "string") return node["statement"];
	if (typeof node["description"] === "string") return node["description"];
	return "";
}
