import type { Profile } from "../entities/Profile.entity";

export interface IProfileRepository {
	getProfile(userId: string): Promise<Profile>;
	createProfile(
		userId: string,
		profileData?: Partial<Profile>,
	): Promise<Profile>;
	updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile>;
	deleteProfile(userId: string): Promise<void>;
}
