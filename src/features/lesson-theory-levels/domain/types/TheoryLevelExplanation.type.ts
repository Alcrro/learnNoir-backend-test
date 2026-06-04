export type {
	ExplanationLevel,
	ExplanationSource,
	ExplanationStatus,
	ExplanationMeta,
	TheoryLevelExplanation,
	UpsertTheoryLevelExplanationInput,
} from "../../../../../../shared/src/theory-level-explanation.ts";

export const EXPLANATION_LEVELS: import("../../../../../../shared/src/theory-level-explanation.ts").ExplanationLevel[] =
	["copil", "licean", "student", "expert"];
