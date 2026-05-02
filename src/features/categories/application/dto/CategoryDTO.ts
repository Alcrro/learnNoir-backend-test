import { z } from "zod";

export const CreateCategorySchema = z.object({
	name: z.string().min(2),
	subjectId: z.string().uuid(),
	position: z.number().int().optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
