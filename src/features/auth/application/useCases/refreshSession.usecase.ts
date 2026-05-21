import type { IAuthRepository } from "../repositories/auth.interfaces.ts";
import type { AuthSession } from "../dto/Auth.type.ts";

export class RefreshSessionUseCase {
	constructor(private readonly authRepo: IAuthRepository) {}

	async execute(refreshToken: string): Promise<AuthSession> {
		return this.authRepo.refreshSession(refreshToken);
	}
}
