import { z } from "zod";

export const CreateLessonSchema = z.object({
	moduleId: z.string().min(1, "moduleId is required"),
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().max(1000).optional().nullable(),
	durationSeconds: z.number().int().min(0).optional(),
	position: z.number().int().nonnegative().optional().nullable(),
	gradeLevelId: z.string().optional().nullable(),
	isActive: z.boolean().optional(),
});

export const UpdateLessonSchema = CreateLessonSchema.partial().refine(
	(obj) => Object.keys(obj).length > 0,
	{ message: "At least one field is required" },
);

export const GenerateBlocksSchema = z.object({
	text: z.string().min(10, "Text must be at least 10 characters").max(10_000),
});
