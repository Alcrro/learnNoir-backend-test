import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository";
import type { LessonBlock } from "../dto/LessonBlock.dto";

// Returns all blocks for a lesson in ascending position order.
// The repository already sorts by position, so no extra sorting is done here.
export class GetBlocksByLessonIdUseCase {
	constructor(private readonly lessonBlockRepository: LessonBlockRepository) {}

	async execute(lessonId: string): Promise<LessonBlock[]> {
		const blocks = await this.lessonBlockRepository.findByLessonId(lessonId);

		// toPrimitives() serialises each entity to a plain LessonBlock object
		return blocks.map((block) => block.toPrimitives());
	}
}
