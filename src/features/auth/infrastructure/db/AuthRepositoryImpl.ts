import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { IAuthRepository } from "../../application/repositories/auth.interfaces";
import { AuthRepoImplMapper } from "../mapper/authRepoImpl.mapper";
import { AppError } from "../../../../utils/errors/AppError";
import { env } from "../../../../config/env.ts";
import type {
	AuthResult,
	AuthSession,
	OAuthProvider,
} from "../../application/dto/Auth.type";
import type { Database } from "../../../../database.types.ts";

export class AuthRepositoryImpl implements IAuthRepository {
	constructor(
		private readonly db: SupabaseClient,
		private readonly adminDb: SupabaseClient,
	) {}

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

	loginWithOAuth(_provider: OAuthProvider): Promise<void> {
		throw new AppError("Method not implemented.");
	}

	async getCurrentUser(): Promise<AuthResult | null> {
		const { data, error } = await this.db.auth.getUser();

		if (error) throw new AppError(error.message);

		if (!data.user) return null;

		return AuthRepoImplMapper.authRepoResultImplMapper(data.user);
	}

	async refreshSession(refreshToken: string): Promise<AuthSession> {
		const { data, error } = await this.db.auth.refreshSession({
			refresh_token: refreshToken,
		});

		if (error) throw new AppError(error.message);
		if (!data.session) throw new AppError("Could not refresh session");

		return AuthRepoImplMapper.authLoginSessionMapper(data.session);
	}

	logout(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async forgotPassword(email: string, redirectTo: string): Promise<void> {
		const { error } = await this.db.auth.resetPasswordForEmail(email, { redirectTo });
		if (error) throw new AppError(error.message);
	}

	async resetPassword(code: string, newPassword: string): Promise<void> {
		// Fresh client per call — avoids polluting the shared singleton's session state
		const tempClient = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
		const { data, error } = await tempClient.auth.exchangeCodeForSession(code);
		if (error || !data.user) throw new AppError("Invalid or expired reset link", 400);
		const { error: updateError } = await this.adminDb.auth.admin.updateUserById(
			data.user.id,
			{ password: newPassword },
		);
		if (updateError) throw new AppError(updateError.message);
	}
}
