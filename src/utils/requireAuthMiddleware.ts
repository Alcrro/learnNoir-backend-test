import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RequestWithUserId } from "../features/auth/interfaces/controllers/Auth.controller";
import type { role } from "../features/profiles/application/dto/ProfileDTO.type";
import { FindProfileUseCase } from "../features/profiles/application/useCase/FindProfile.usecase";
import { ProfileRepoImpl } from "../features/profiles/infrastructures/db/ProfilesRepoImpl";
import { supabase } from "../core/db/supabaseClient";

export const requireAuthMiddleware = async (
	req: RequestWithUserId,
	res: Response,
	next: NextFunction,
) => {
	const accessToken = req.cookies.accessToken;

	if (!accessToken) {
		console.log("No access token provided");
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	const profileRepoImpl = new ProfileRepoImpl(supabase);
	const profileUseCase = new FindProfileUseCase(profileRepoImpl);

	try {
		const decode = jwt.decode(accessToken) as JwtPayload & { userRole?: role };

		if (!decode) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const userProfile = await profileUseCase.execute(decode.sub as string);
		if (!userProfile) {
			console.log("Invalid access token");
			res.status(401).json({ error: "Unauthorized" });
			return;
		}
		const role = userProfile.role as role;

		if (!role) {
			console.log("User profile not found");
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		req.userId = decode.sub as string;
		req.userRole = role;

		next();
	} catch (error) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}
};
