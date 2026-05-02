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

// Known engines — for reference only, not used as exhaustive guards.
// New engines for any subject can be added without touching this list.
export const KNOWN_INTERACTIVE_ENGINES = [
	"algorithm:bubble-sort",
	"math:formula",
] as const;

export const KNOWN_ASSESSMENT_ENGINES = [
	"quiz:mcq",
	"quiz:input",
	"quiz:code",
] as const;

export type LessonBlockType = (typeof LESSON_BLOCK_TYPES)[number];

export function isLessonBlockType(value: string): value is LessonBlockType {
	return LESSON_BLOCK_TYPES.includes(value as LessonBlockType);
}
