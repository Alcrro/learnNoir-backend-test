import { AppError } from "../../../../utils/errors/AppError";
import type { IProfileRepository } from "../../domain/repositories/ProfileRepository.interfaces";
import { ProfileDTOMapper } from "../dto/ProfileDTO.dto";
import type { ProfileDTO } from "../dto/ProfileDTO.type";

export class FindProfileUseCase {
	constructor(private profileRepository: IProfileRepository) {}

	async execute(userId: string): Promise<ProfileDTO> {
		try {
			const profile = await this.profileRepository.getProfile(userId);
			return ProfileDTOMapper.toDTO(profile);
		} catch (error) {
			throw new AppError(
				`Failed to find profile: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
