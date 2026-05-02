import type { IAuthRepository } from "../repositories/auth.interfaces";
import { AuthDTO, type UserAuthDTO } from "../dto/Auth.dto";

export class AuthWithCredetials {
	constructor(private readonly authRepo: IAuthRepository) {}

	async execute(email: string, password: string): Promise<UserAuthDTO> {
		const data = await this.authRepo.loginWithPassword(email, password);

		return AuthDTO.AuhResponse(data);
	}
}
