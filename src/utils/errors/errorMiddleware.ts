import { AppError } from "./AppError";
import type { NextFunction, Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
	res.status(404).json({ error: "Route not found" });
};

export const errorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.log(err);

	if (res.headersSent) return next(err);

	if (err instanceof AppError) {
		return res
			.status(err.statusCode)
			.json({ success: false, error: err.message });
	}

	return res.status(500).json({ error: "Internal Server Error" });
};
