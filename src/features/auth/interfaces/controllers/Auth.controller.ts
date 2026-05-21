import type { Request, Response } from "express";
import { env } from "../../../../config/env";
import { RegisterUserUseCase } from "../../application/useCases/registerUser.usecase";
import { AuthWithCredentials } from "../../application/useCases/authWithCredentials.usecase";
import { RefreshSessionUseCase } from "../../application/useCases/refreshSession.usecase";
import type { role } from "../../../profiles/application/dto/ProfileDTO.type";

export type RequestWithUserId = Request & { userId?: string; userRole?: role };
export class AuthController {
	constructor(
		private readonly authServices: {
			registerUseCase: RegisterUserUseCase;
			authUseCase: AuthWithCredentials;
			refreshUseCase: RefreshSessionUseCase;
		},
	) {}

	register = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(404).json({ error: "Invalid fields!" });
		}

		const registerUser = await this.authServices.registerUseCase.execute(
			email,
			password,
		);

		return res.status(201).json({ success: true, message: registerUser });
	};

	login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(404).json({ error: "Wrong redentials" });
		}

		const loginUser = await this.authServices.authUseCase.execute(
			email,
			password,
		);

		const { isProd } = env;
		res.cookie("accessToken", loginUser.accessToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "strict",
			maxAge: 60 * 60 * 1000, // 1 oră — egal cu expiry-ul Supabase access token
		});

		res.cookie("refreshToken", loginUser.refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 zile — refresh token Supabase default
		});

		const { accessToken: _at, refreshToken: _rt, ...safeData } = loginUser;
		return res.status(201).json({ success: true, data: safeData });
	};

	getCurrentUser = async (req: RequestWithUserId, res: Response) => {
		const userId = req.userId;

		if (!userId) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ success: true, data: { userId } });
	};

	refresh = async (req: Request, res: Response) => {
		const refreshToken = req.cookies.refreshToken as string | undefined;

		if (!refreshToken) {
			return res.status(401).json({ error: "No refresh token" });
		}

		const session = await this.authServices.refreshUseCase.execute(refreshToken);

		const { isProd } = env;
		res.cookie("accessToken", session.accessToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "strict",
			maxAge: 60 * 60 * 1000,
		});
		res.cookie("refreshToken", session.refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({ success: true });
	};

	logout = async (_req: Request, res: Response) => {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return res.status(200).json({ success: true, message: "Logged out" });
	};
}
