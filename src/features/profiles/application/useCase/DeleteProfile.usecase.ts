import { AppError } from "../../../../utils/errors/AppError";
import type { IProfileRepository } from "../../domain/repositories/ProfileRepository.interfaces";

export class DeleteProfileUseCase {
	constructor(private profileRepository: IProfileRepository) {}

	async execute(userId: string) {
		try {
			await this.profileRepository.deleteProfile(userId);
			return { message: "Profile deleted successfully" };
		} catch (error) {
			throw new AppError(
				`Failed to delete profile: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
