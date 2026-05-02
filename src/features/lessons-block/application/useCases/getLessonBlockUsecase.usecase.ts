import { AppError } from "../../../../utils/errors/AppError";
import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository";
import type { LessonBlock } from "../dto/LessonBlock.dto";

export class GetLessonBlockUsecase {
	constructor(
		private readonly lessonBlockRepository: LessonBlockRepository,
	) {}

	async execute(id: string): Promise<LessonBlock> {
		const block = await this.lessonBlockRepository.findById(id);

		if (!block) {
			throw new AppError(`Lesson block with id ${id} not found`, 404);
		}

		return block.toPrimitives();
	}
}
