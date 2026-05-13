import type { Request, Response } from "express";
import { env } from "../../../../config/env";
import { RegisterUserUseCase } from "../../application/useCases/registerUser.usecase";
import { AuthWithCredetials } from "../../application/useCases/authWithCredentials.usecase";
import type { role } from "../../../profiles/application/dto/ProfileDTO.type";

export type RequestWithUserId = Request & { userId?: string; userRole?: role };
export class AuthController {
	constructor(
		private readonly authServices: {
			registerUseCase: RegisterUserUseCase;
			authUseCase: AuthWithCredetials;
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
		});

		res.cookie("refreshToken", loginUser.refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "strict",
		});

		return res.status(201).json({ success: true, data: loginUser });
	};

	getCurrentUser = async (req: RequestWithUserId, res: Response) => {
		const userId = req.userId;

		if (!userId) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ success: true, data: { userId } });
	};

	logout = async (req: Request, res: Response) => {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return res.status(200).json({ success: true, message: "Logged out" });
	};
}
