import type {
	TheoryLevelExplanation,
	ExplanationLevel,
	UpsertTheoryLevelExplanationInput,
} from "../types/TheoryLevelExplanation.type.ts";

export interface ITheoryLevelExplanationRepo {
	findByBlock(lessonBlockId: string): Promise<TheoryLevelExplanation[]>;
	findByBlockAndLevel(lessonBlockId: string, level: ExplanationLevel): Promise<TheoryLevelExplanation | null>;
	upsert(lessonBlockId: string, input: UpsertTheoryLevelExplanationInput): Promise<TheoryLevelExplanation>;
	delete(lessonBlockId: string, level: ExplanationLevel): Promise<void>;
}
