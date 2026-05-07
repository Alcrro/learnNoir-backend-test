import type { Database } from "../../../../database.types.ts";

export type LessonActivitiesTable =
	Database["public"]["Tables"]["lesson_activities"];
export type LessonActivityRow = LessonActivitiesTable["Row"];
export type LessonActivityInsert = LessonActivitiesTable["Insert"];
export type LessonActivityUpdate = LessonActivitiesTable["Update"];

export const ACTIVITY_TYPES = [
	"content",
	"quiz",
	"exercise",
	"critical_thinking",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export function isActivityType(value: string): value is ActivityType {
	return ACTIVITY_TYPES.includes(value as ActivityType);
}
