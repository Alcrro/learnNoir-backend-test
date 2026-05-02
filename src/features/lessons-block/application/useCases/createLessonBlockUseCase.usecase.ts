import { DatabaseError } from "../../../../utils/errors/DatabaseError";
import type { ILessonRepository } from "../../../lessons/domain/repositories/LeasonRepository";
import type { CreateLessonBlockDTO } from "../dto/LessonBlock.dto";
import type { LessonBlockFactory } from "../../domain/factories/lessonBlock.factory";
import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository";
import type { LessonBlock } from "../../domain/types/LessionEngine.type";
import { BadRequestError } from "../../../../utils/errors/DatabaseError";

export class CreateLessonBlockUseCase {
	constructor(
		private readonly lessonBlockRepository: LessonBlockRepository,
		private readonly lessonRepository: ILessonRepository,
		private readonly lessonBlockFactory: LessonBlockFactory,
	) {}

	async execute(lessonBlock: CreateLessonBlockDTO): Promise<LessonBlock> {
		await this.lessonRepository.get(lessonBlock.lessonId);

		const existingBlocks = await this.lessonBlockRepository.findByLessonId(
			lessonBlock.lessonId,
		);
		const creationPosition = existingBlocks.length;
		const targetPosition = this.resolveTargetPosition(
			lessonBlock.position,
			creationPosition,
		);

		const createdLessonBlock = this.lessonBlockFactory.create({
			...lessonBlock,
			position: creationPosition,
		});
		console.log(createdLessonBlock);
		if (!createdLessonBlock) {
			throw new BadRequestError("Invalid lesson block payload");
		}

		const persistedLessonBlock =
			await this.lessonBlockRepository.create(createdLessonBlock);

		// We append first, then reuse the repository reorder flow so positions stay contiguous.
		if (targetPosition !== creationPosition) {
			await this.lessonBlockRepository.reorder(
				lessonBlock.lessonId,
				persistedLessonBlock.id,
				targetPosition,
			);

			const reorderedBlock = await this.lessonBlockRepository.findById(
				persistedLessonBlock.id,
			);

			if (!reorderedBlock) {
				throw new DatabaseError("Created lesson block could not be reloaded");
			}

			return reorderedBlock.toPrimitives();
		}

		return persistedLessonBlock.toPrimitives();
	}

	private resolveTargetPosition(
		requestedPosition: number | undefined,
		blocksCount: number,
	) {
		if (requestedPosition === undefined) {
			return blocksCount;
		}

		if (!Number.isInteger(requestedPosition) || requestedPosition < 0) {
			throw new BadRequestError(
				"Lesson block position must be a non-negative integer",
			);
		}

		if (requestedPosition > blocksCount) {
			throw new BadRequestError("Lesson block position is outside lesson range");
		}

		return requestedPosition;
	}
}
