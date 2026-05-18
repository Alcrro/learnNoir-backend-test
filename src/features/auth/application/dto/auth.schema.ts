import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required").max(128, "Password too long"),
});

export const RegisterSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password too long"),
});
