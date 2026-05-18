import { z } from "zod";

export const UpdateProfileSchema = z
	.object({
		username: z.string().min(1).max(50).optional(),
		avatarUrl: z.string().url("Invalid URL").optional().nullable(),
	})
	.refine((obj) => Object.keys(obj).length > 0, {
		message: "At least one field is required",
	});
