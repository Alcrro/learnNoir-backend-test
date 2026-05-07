import { DatabaseError } from "../../../../utils/errors/DatabaseError.ts";
import { BadRequestError } from "../../../../utils/errors/DatabaseError.ts";
import type { ILessonRepository } from "../../../lessons/domain/repositories/LeasonRepository.ts";
import { LessonActivityEntity } from "../../domain/entities/LessonActivityEntity.ts";
import type { LessonActivityRepository } from "../../domain/repositories/LessonActivityRepository.ts";
import type { LessonActivity } from "../../domain/types/LessonActivity.type.ts";
import type { CreateLessonActivityDTO } from "../dto/LessonActivity.dto.ts";

export class CreateLessonActivityUseCase {
	constructor(
		private readonly lessonActivityRepository: LessonActivityRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(dto: CreateLessonActivityDTO): Promise<LessonActivity> {
		await this.lessonRepository.get(dto.lessonId);

		const existing = await this.lessonActivityRepository.findByLessonId(
			dto.lessonId,
		);
		const appendPosition = existing.length;
		const targetPosition = this.resolveTargetPosition(
			dto.position,
			appendPosition,
		);

		const entity = new LessonActivityEntity({
			lessonId: dto.lessonId,
			lessonBlockId: dto.lessonBlockId ?? null,
			type: dto.type,
			title: dto.title,
			weight: dto.weight ?? 1,
			required: dto.required ?? true,
			position: appendPosition,
		});

		const persisted = await this.lessonActivityRepository.create(entity);

		if (targetPosition !== appendPosition) {
			await this.lessonActivityRepository.reorder(
				dto.lessonId,
				persisted.id,
				targetPosition,
			);

			const reloaded = await this.lessonActivityRepository.findById(persisted.id);
			if (!reloaded) {
				throw new DatabaseError("Created activity could not be reloaded");
			}
			return reloaded.toPrimitives();
		}

		return persisted.toPrimitives();
	}

	private resolveTargetPosition(
		requested: number | undefined,
		count: number,
	): number {
		if (requested === undefined) return count;
		if (!Number.isInteger(requested) || requested < 0) {
			throw new BadRequestError(
				"Activity position must be a non-negative integer",
			);
		}
		if (requested > count) {
			throw new BadRequestError("Activity position is outside lesson range");
		}
		return requested;
	}
}
