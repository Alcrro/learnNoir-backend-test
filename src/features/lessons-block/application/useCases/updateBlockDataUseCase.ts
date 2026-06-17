import { AppError } from "../../../../utils/errors/AppError.ts";
import { NotFoundError } from "../../../../utils/errors/DatabaseError.ts";
import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository.ts";

export class UpdateBlockDataUseCase {
	constructor(private readonly repo: LessonBlockRepository) {}

	async execute(blockId: string, data: Record<string, unknown>): Promise<void> {
		const block = await this.repo.findById(blockId);
		if (!block) throw new NotFoundError("Block not found");
		if (block.toPrimitives().type === "content") {
			throw new AppError("Content blocks do not support data updates via this endpoint", 400);
		}
		await this.repo.updateBlockData(blockId, data);
	}
}
