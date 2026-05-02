import { Profile } from "../../domain/entities/Profile.entity";
import type { ProfileDTO } from "./ProfileDTO.type";
export class ProfileDTOMapper {
	static toDTO(profile: Profile): ProfileDTO {
		return {
			id: profile.id,
			username: profile.username,
			email: profile.email,
			role: profile.role,
			...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
		};
	}
}
