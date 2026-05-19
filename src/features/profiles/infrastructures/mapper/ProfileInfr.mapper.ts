import { Profile } from "../../domain/entities/Profile.entity";
import type { role } from "../../application/dto/ProfileDTO.type";

export class ProfileIfrMapper {
	static toProfileEntity(data: Record<string, unknown>): Profile {
		return new Profile(
			data.id as string,
			data.username as string,
			data.email as string,
			data.role as role,
			data.avatarUrl as string | undefined,
		);
	}
}
