import { type NextFunction, type Request, type Response } from "express";

type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<any>;

//cath reutilizble trycath to not do every time on each function
export const asyncHandlerMiddleware = (fn: AsyncHandler) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
