import type { ITheoryLevelExplanationRepo } from "../../domain/repositories/ITheoryLevelExplanationRepo.ts";
import type { TheoryLevelExplanation } from "../../domain/types/TheoryLevelExplanation.type.ts";

export class GetBlockExplanationsUseCase {
	constructor(private readonly repo: ITheoryLevelExplanationRepo) {}

	async execute(lessonBlockId: string): Promise<TheoryLevelExplanation[]> {
		return this.repo.findByBlock(lessonBlockId);
	}
}
