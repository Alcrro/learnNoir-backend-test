import type { IAuthRepository } from "../repositories/auth.interfaces";

export class ResetPasswordUseCase {
	constructor(private readonly authRepo: IAuthRepository) {}

	async execute(code: string, newPassword: string): Promise<void> {
		await this.authRepo.resetPassword(code, newPassword);
	}
}
