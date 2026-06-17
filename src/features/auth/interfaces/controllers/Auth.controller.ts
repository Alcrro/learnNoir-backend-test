import type { Request, Response } from "express";
import { env } from "../../../../config/env";
import { RegisterUserUseCase } from "../../application/useCases/registerUser.usecase";
import { AuthWithCredentials } from "../../application/useCases/authWithCredentials.usecase";
import { RefreshSessionUseCase } from "../../application/useCases/refreshSession.usecase";
import { ForgotPasswordUseCase } from "../../application/useCases/forgotPassword.usecase";
import { ResetPasswordUseCase } from "../../application/useCases/resetPassword.usecase";
import type { role } from "../../../profiles/application/dto/ProfileDTO.type";

export type RequestWithUserId = Request & { userId?: string; userRole?: role };
export class AuthController {
	constructor(
		private readonly authServices: {
			registerUseCase: RegisterUserUseCase;
			authUseCase: AuthWithCredentials;
			refreshUseCase: RefreshSessionUseCase;
			forgotPasswordUseCase: ForgotPasswordUseCase;
			resetPasswordUseCase: ResetPasswordUseCase;
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

		return res.status(201).json({ data: registerUser });
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
		return res.status(200).json({ data: safeData });
	};

	getCurrentUser = async (req: RequestWithUserId, res: Response) => {
		const userId = req.userId;

		if (!userId) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ data: { userId } });
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

		return res.status(200).json({ data: null });
	};

	logout = async (_req: Request, res: Response) => {
		const { isProd } = env;
		const cookieOpts = {
			httpOnly: true,
			secure: isProd,
			sameSite: (isProd ? "none" : "strict") as "none" | "strict",
		};
		res.clearCookie("accessToken", cookieOpts);
		res.clearCookie("refreshToken", cookieOpts);

		return res.status(200).json({ data: null });
	};

	forgotPassword = async (req: Request, res: Response) => {
		const { email } = req.body as { email?: string };
		if (!email) return res.status(400).json({ error: "Email required" });
		const redirectTo = `${env.CORS_ORIGIN}/auth/reset-password`;
		await this.authServices.forgotPasswordUseCase.execute(email, redirectTo);
		return res.status(200).json({ data: null });
	};

	resetPassword = async (req: Request, res: Response) => {
		const { code, newPassword } = req.body as { code?: string; newPassword?: string };
		if (!code || !newPassword) return res.status(400).json({ error: "Code and new password required" });
		await this.authServices.resetPasswordUseCase.execute(code, newPassword);
		return res.status(200).json({ data: null });
	};
}
