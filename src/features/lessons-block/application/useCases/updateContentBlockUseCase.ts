import { AppError } from "../../../../utils/errors/AppError";
import { NotFoundError } from "../../../../utils/errors/DatabaseError";
import { ContentBlockEntity } from "../../domain/entities/ContentBlockEntity";
import type { LessonBlockRepository } from "../../domain/repositories/LessonBlockRepository";
import type { LessonContentNode } from "../../domain/types/LessionEngine.type";

export class UpdateContentBlockUseCase {
	constructor(private readonly repo: LessonBlockRepository) {}

	async execute(blockId: string, content: Record<string, unknown>[]): Promise<void> {
		const block = await this.repo.findById(blockId);
		if (!block) throw new NotFoundError("Block not found");
		if (!(block instanceof ContentBlockEntity)) {
			throw new AppError("Only content blocks support content updates", 400);
		}
		block.update({ content: content as unknown as LessonContentNode[] });
		await this.repo.update(blockId, block);
	}
}
