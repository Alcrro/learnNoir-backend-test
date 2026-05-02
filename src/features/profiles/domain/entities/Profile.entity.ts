import type { role } from "../../application/dto/ProfileDTO.type";

export class Profile {
	constructor(
		public id: string,
		public username: string,
		public email: string,
		public role: role,
		public avatarUrl?: string,
	) {}
}
