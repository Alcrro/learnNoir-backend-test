import type { IAuthRepository } from "../repositories/auth.interfaces";

export class ForgotPasswordUseCase {
	constructor(private readonly authRepo: IAuthRepository) {}

	async execute(email: string, redirectTo: string): Promise<void> {
		await this.authRepo.forgotPassword(email, redirectTo);
	}
}
