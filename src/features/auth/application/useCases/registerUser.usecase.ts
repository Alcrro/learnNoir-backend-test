import type { IProfileRepository } from "../../../profiles/domain/repositories/ProfileRepository.interfaces";
import type { IAuthRepository } from "../repositories/auth.interfaces";
import { AppError } from "../../../../utils/errors/AppError";

export class RegisterUserUseCase {
	constructor(
		private readonly authRepo: IAuthRepository,
		private readonly profileRepo: IProfileRepository,
	) {}

	async execute(email: string, password: string): Promise<string> {
		try {
			const data = await this.authRepo.registerWithPassword(email, password);

			if (!data.userId) {
				throw new Error("User ID missing from registration response");
			}

			await this.profileRepo.createProfile(data.userId);
			return "You are registered successfully!";
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes("User already registered")) {
					throw new AppError("You are already registered", 409);
				}
			}
			throw error;
		}
	}
}
