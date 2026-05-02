import type { role } from "../../../profiles/application/dto/ProfileDTO.type";
import type { AuthResult } from "./Auth.type";

export type UserAuthDTO = {
	user: AuthResult;
	accessToken: string;
	refreshToken: string;
};
export class AuthDTO {
	constructor() {}

	static AuhResponse(session: UserAuthDTO) {
		return {
			user: session.user,
			accessToken: session.accessToken,
			refreshToken: session.refreshToken,
		};
	}
}
