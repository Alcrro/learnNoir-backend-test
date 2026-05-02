import type { SupabaseClient } from "@supabase/supabase-js";
import { Profile } from "../../domain/entities/Profile.entity";
import type { IProfileRepository } from "../../domain/repositories/ProfileRepository.interfaces";
import { ProfileIfrMapper } from "../mapper/ProfileInfr.mapper";

export class ProfileRepoImpl implements IProfileRepository {
	constructor(private readonly db: SupabaseClient) {}
	async getProfile(userId: string): Promise<Profile> {
		console.log("mere?", userId);

		const { data, error } = await this.db
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) throw new Error(error.message);
		if (!data) throw new Error("Profile not found");

		return ProfileIfrMapper.toProfileEntity(data);
	}

	async createProfile(
		userId: string,
		profileData: Partial<Profile>,
	): Promise<Profile> {
		const { data, error } = await this.db
			.from("profiles")
			.insert({ ...profileData, id: userId })
			.select("*")
			.single();

		if (error) throw new Error(error.message);

		return ProfileIfrMapper.toProfileEntity(data);
	}
	async updateProfile(
		userId: string,
		profileData: Partial<Profile>,
	): Promise<Profile> {
		const { data, error } = await this.db
			.from("profiles")
			.update(profileData)
			.eq("userId", userId)
			.single();

		if (error) throw new Error(error.message);
		if (!data) throw new Error("Profile not found");

		return ProfileIfrMapper.toProfileEntity(data);
	}
	async deleteProfile(userId: string): Promise<void> {
		const { error } = await this.db
			.from("profiles")
			.delete()
			.eq("userId", userId);

		if (error) throw new Error(error.message);
	}
}
