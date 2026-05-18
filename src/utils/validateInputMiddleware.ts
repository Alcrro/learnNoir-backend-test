import { ZodError, type ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";

export const validateInput =
	(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				error: "Validation failed",
				issues: result.error.issues.map((i) => ({
					path: i.path.join(".") || "body",
					message: i.message,
				})),
			});
		}
		req.body = result.data;
		next();
	};
