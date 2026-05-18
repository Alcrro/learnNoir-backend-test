import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import type { AuthResult, AuthSession } from "../../application/dto/Auth.type";

export class AuthRepoImplMapper {
	static authRepoResultImplMapper(user: SupabaseUser): AuthResult {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}

		return {
			userId: user.id,
			...(user.email && { email: user.email }),
		};
	}

	static authLoginSessionMapper(session: Session): AuthSession {
		if (!session?.user?.id) {
			throw new Error("User not authenticated");
		}

		return {
			user: {
				userId: session.user.id,
				...(session.user.email && { email: session.user.email }),
			},
			accessToken: session.access_token,
			refreshToken: session.refresh_token,
		};
	}
}
