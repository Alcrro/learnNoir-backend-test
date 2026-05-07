import { z } from "zod";
import type {
	CreateLessonActivity,
	LessonActivity,
} from "../../domain/types/LessonActivity.type.ts";

export const ACTIVITY_TYPE_VALUES = [
	"content",
	"quiz",
	"exercise",
	"critical_thinking",
] as const;

export const CreateLessonActivitySchema = z.object({
	lessonId: z.string().min(1),
	lessonBlockId: z.string().min(1).nullable().optional(),
	type: z.enum(ACTIVITY_TYPE_VALUES),
	title: z.string().min(1),
	weight: z.number().min(0).default(1),
	required: z.boolean().default(true),
	position: z.coerce.number().int().nonnegative().optional(),
});

export type CreateLessonActivityDTO = CreateLessonActivity;
export type LessonActivityDTO = LessonActivity;

export function parseCreateLessonActivityDTO(
	input: unknown,
): CreateLessonActivityDTO {
	return CreateLessonActivitySchema.parse(input) as CreateLessonActivityDTO;
}
