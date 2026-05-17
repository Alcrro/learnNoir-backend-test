import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository.ts";
import type { LessonBlock } from "../dto/LessonBlock.dto.ts";

const FREE_QUIZ_LIMIT = 4;

export class GetBlocksPreviewUseCase {
	constructor(private readonly repo: LessonBlockRepository) {}

	async execute(lessonId: string): Promise<LessonBlock[]> {
		const blocks = await this.repo.findByLessonId(lessonId);
		const primitives = blocks.map((b) => b.toPrimitives());

		const nonAssessment = primitives.filter((b) => b.type !== "assessment");
		const assessment = primitives
			.filter((b) => b.type === "assessment")
			.slice(0, FREE_QUIZ_LIMIT);

		return [...nonAssessment, ...assessment].sort(
			(a, b) => a.position - b.position,
		);
	}
}
