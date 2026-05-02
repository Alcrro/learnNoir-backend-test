import type { Database, Json } from "../../../../database.types";

export type LessonBlocksTable = Database["public"]["Tables"]["lesson_blocks"];
export type LessonBlockRow = LessonBlocksTable["Row"];
export type LessonBlockInsert = LessonBlocksTable["Insert"];
export type LessonBlockUpdate = LessonBlocksTable["Update"];
export type LessonBlockJson = Json;

export const LESSON_BLOCK_TYPES = [
	"content",
	"interactive",
	"assessment",
] as const;

export const INTERACTIVE_ENGINES = [
	"algorithm:bubble-sort",
	"math:formula",
] as const;

export const ASSESSMENT_ENGINES = [
	"quiz:mcq",
	"quiz:input",
	"quiz:code",
] as const;

export type LessonBlockType = (typeof LESSON_BLOCK_TYPES)[number];
export type InteractiveEngine = (typeof INTERACTIVE_ENGINES)[number];
export type AssessmentEngine = (typeof ASSESSMENT_ENGINES)[number];

export function isLessonBlockType(value: string): value is LessonBlockType {
	return LESSON_BLOCK_TYPES.includes(value as LessonBlockType);
}

export function isInteractiveEngine(value: string): value is InteractiveEngine {
	return INTERACTIVE_ENGINES.includes(value as InteractiveEngine);
}

export function isAssessmentEngine(value: string): value is AssessmentEngine {
	return ASSESSMENT_ENGINES.includes(value as AssessmentEngine);
}
