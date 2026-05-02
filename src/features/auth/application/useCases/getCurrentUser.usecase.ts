import type { IAuthRepository } from "../repositories/auth.interfaces";

export class GetCurrentUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute() {
		const user = await this.authRepository.getCurrentUser();
		return user;
	}
}
