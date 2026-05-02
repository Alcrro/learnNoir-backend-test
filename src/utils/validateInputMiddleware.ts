import type { NextFunction, Request, Response } from "express";
import { type ZodSchema } from "zod";

export const validateInput =
	(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
		// Implementation for validating input

		try {
			const parsedData = schema.parse(req.body);
			req.body = parsedData; // Replace the original body with the parsed data
			next();
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json({ error: error.message }); // Send validation errors back to the client
			} else {
				res.status(400).json({ error: "Invalid input" }); // Send validation errors back to the client
			}
			// You can customize the error response as needed
		}
	};
