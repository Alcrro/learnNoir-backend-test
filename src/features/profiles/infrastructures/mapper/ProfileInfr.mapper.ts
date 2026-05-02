import { Profile } from "../../domain/entities/Profile.entity";

export class ProfileIfrMapper {
	static toProfileEntity(data: any): Profile {
		return new Profile(
			data.id,
			data.username,
			data.email,
			data.role,
			data.avatarUrl,
		);
	}
}
