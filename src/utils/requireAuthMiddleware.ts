import type { NextFunction, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { RequestWithUserId } from "../features/auth/interfaces/controllers/Auth.controller";
import type { role } from "../features/profiles/application/dto/ProfileDTO.type";
import { FindProfileUseCase } from "../features/profiles/application/useCase/FindProfile.usecase";
import { ProfileRepoImpl } from "../features/profiles/infrastructures/db/ProfilesRepoImpl";
import { supabase } from "../core/db/supabaseClient";
import { supabaseAuth } from "../core/db/supabaseAuthClient";
import { env } from "../config/env";
import { logger } from "../core/logger";

// JWKS is fetched once and cached in-process — handles key rotation automatically
const JWKS = createRemoteJWKSet(
	new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

// Singletons — repo and use-case are stateless wrappers; no need to re-instantiate per request
const profileRepo = new ProfileRepoImpl(supabase);
const profileUseCase = new FindProfileUseCase(profileRepo);

function setCookies(res: Response, accessToken: string, refreshToken: string) {
	const { isProd } = env;
	const cookieOpts = {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? ("none" as const) : ("strict" as const),
	};
	res.cookie("accessToken", accessToken, { ...cookieOpts, maxAge: 60 * 60 * 1000 });
	res.cookie("refreshToken", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

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
	} catch (err) {
		const errCode = err instanceof Error && "code" in err ? (err as { code: string }).code : "unknown";
		logger.warn({ errCode }, "[auth] jwtVerify failed");

		const isExpired = errCode === "ERR_JWT_EXPIRED";
		if (!isExpired) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		// Access token expired — try to silently refresh using the refresh token cookie
		const refreshToken = req.cookies.refreshToken as string | undefined;
		if (!refreshToken) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		try {
			logger.info("[auth] Access token expired, attempting silent refresh");
			const { data, error } = await supabaseAuth.auth.refreshSession({
				refresh_token: refreshToken,
			});

			if (error || !data.session) {
				logger.warn({ msg: error?.message }, "[auth] Refresh failed");
				res.clearCookie("accessToken");
				res.clearCookie("refreshToken");
				res.status(401).json({ error: "Session expired, please login again" });
				return;
			}

			setCookies(res, data.session.access_token, data.session.refresh_token);

			const sub = data.session.user.id;
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
			logger.info("[auth] Silent refresh successful");
			next();
		} catch {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
			res.status(401).json({ error: "Unauthorized" });
		}
	}
};
