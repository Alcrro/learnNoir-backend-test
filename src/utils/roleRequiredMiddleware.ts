import type { NextFunction, Request, Response } from "express";
import type { role } from "../features/profiles/application/dto/ProfileDTO.type";

type RequestWithUser = Request & { userRole?: role };
export function roleRequiredMiddleware(requiredRole: role[]) {
	return (req: RequestWithUser, res: Response, next: NextFunction) => {
		const userRole = req?.userRole; // Assuming req.user is populated by authentication middleware

		if (!userRole) {
			return res.status(401).json({ message: "Unauthorized: No role found" });
		}

		if (!requiredRole.includes(userRole)) {
			return res.status(403).json({ message: "Forbidden: Insufficient role" });
		}

		return next();
	};
}
