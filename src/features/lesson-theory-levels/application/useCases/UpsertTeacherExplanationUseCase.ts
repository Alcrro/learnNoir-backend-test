import type { ITheoryLevelExplanationRepo } from "../../domain/repositories/ITheoryLevelExplanationRepo.ts";
import type {
	TheoryLevelExplanation,
	ExplanationLevel,
} from "../../domain/types/TheoryLevelExplanation.type.ts";

export class UpsertTeacherExplanationUseCase {
	constructor(private readonly repo: ITheoryLevelExplanationRepo) {}

	async execute(
		lessonBlockId: string,
		level: ExplanationLevel,
		content: string,
	): Promise<TheoryLevelExplanation> {
		return this.repo.upsert(lessonBlockId, { level, content, source: "teacher" });
	}
}
