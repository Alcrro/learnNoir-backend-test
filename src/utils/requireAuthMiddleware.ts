import type { NextFunction, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { RequestWithUserId } from "../features/auth/interfaces/controllers/Auth.controller";
import type { role } from "../features/profiles/application/dto/ProfileDTO.type";
import { FindProfileUseCase } from "../features/profiles/application/useCase/FindProfile.usecase";
import { ProfileRepoImpl } from "../features/profiles/infrastructures/db/ProfilesRepoImpl";
import { supabase } from "../core/db/supabaseClient";
import { env } from "../config/env";

// JWKS is fetched once and cached in-process — handles key rotation automatically
const JWKS = createRemoteJWKSet(
	new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

export const requireAuthMiddleware = async (
	req: RequestWithUserId,
	res: Response,
	next: NextFunction,
) => {
	const accessToken = req.cookies.accessToken as string | undefined;

	if (!accessToken) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	const profileRepoImpl = new ProfileRepoImpl(supabase);
	const profileUseCase = new FindProfileUseCase(profileRepoImpl);

	try {
		const { payload } = await jwtVerify(accessToken, JWKS);

		const sub = payload.sub;
		if (!sub) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const userProfile = await profileUseCase.execute(sub);
		if (!userProfile) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const role = userProfile.role as role;
		if (!role) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		req.userId = sub;
		req.userRole = role;

		next();
	} catch {
		res.status(401).json({ error: "Unauthorized" });
	}
};
