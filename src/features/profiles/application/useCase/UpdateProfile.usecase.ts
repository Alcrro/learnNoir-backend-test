import { AppError } from "../../../../utils/errors/AppError";
import type { Profile } from "../../domain/entities/Profile.entity";
import type { IProfileRepository } from "../../domain/repositories/ProfileRepository.interfaces";

export class UpdateProfileUseCase {
	constructor(private profileRepository: IProfileRepository) {}

	async execute(userId: string, profileData: Partial<Profile>) {
		try {
			const updatedProfile = await this.profileRepository.updateProfile(
				userId,
				profileData,
			);
			return updatedProfile;
		} catch (error) {
			throw new AppError(
				`Failed to update profile: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
