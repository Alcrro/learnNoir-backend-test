import type { IProfileRepository } from "../../../profiles/domain/repositories/ProfileRepository.interfaces";
import type { IAuthRepository } from "../repositories/auth.interfaces";

export class RegisterUserUseCase {
	constructor(
		private readonly authRepo: IAuthRepository,
		private readonly profileRepo: IProfileRepository,
	) {}

	async execute(email: string, passsword: string): Promise<string> {
		try {
			const data = await this.authRepo.registerWithPassword(email, passsword);
			console.log(data);

			if (!data.userId) {
				throw new Error("User ID missing from registration response");
			}

			await this.profileRepo.createProfile(data.userId);
			return "You are registered succesfully!";
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes("User already registered")) {
					return "You are already registered!";
				}
			}
			throw error; // Rethrow the error if it's not a known case
		}
	}
}
