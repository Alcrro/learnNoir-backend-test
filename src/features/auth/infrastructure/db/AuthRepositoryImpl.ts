import type { SupabaseClient } from "@supabase/supabase-js";
import type { IAuthRepository } from "../../application/repositories/auth.interfaces";
import { AuthRepoImplMapper } from "../mapper/authRepoImpl.mapper";
import { AppError } from "../../../../utils/errors/AppError";
import type {
	AuthResult,
	AuthSession,
	OAuthProvider,
} from "../../application/dto/Auth.type";

export class AuthRepositoryImpl implements IAuthRepository {
	constructor(private readonly db: SupabaseClient) {}

	async registerWithPassword(
		email: string,
		password: string,
	): Promise<AuthResult> {
		const { data, error } = await this.db.auth.signUp({ email, password });

		if (error) throw new Error(error.message);
		if (!data) throw new Error("User not created");
		if (!data.user) throw new Error("User not created");

		return AuthRepoImplMapper.authRepoResultImplMapper(data.user);
	}
	async loginWithPassword(
		email: string,
		password: string,
	): Promise<AuthSession> {
		const { data, error } = await this.db.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw new AppError(error.message);

		if (!data.session) {
			throw new AppError("User ID missing from auth response");
		}

		return AuthRepoImplMapper.authLoginSessionMapper(data.session);
	}
	async loginWithLink(email: string): Promise<void> {
		const { data, error } = await this.db.auth.signInWithOtp({
			email,
		});

		if (error) throw new AppError(error.message);
		if (!data) throw new AppError("User not found");
	}

	loginWithOAuth(provider: OAuthProvider): Promise<void> {
		throw new AppError("Method not implemented.");
	}

	async getCurrentUser(): Promise<AuthResult | null> {
		const { data, error } = await this.db.auth.getUser();

		if (error) throw new AppError(error.message);

		if (!data.user) return null;

		return AuthRepoImplMapper.authRepoResultImplMapper(data.user);
	}

	logout(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
