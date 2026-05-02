import type { role } from "../../../profiles/application/dto/ProfileDTO.type";

/**
 * Auth result returned after a successful authentication.
 */
export interface AuthResult {
	/** Unique identifier of the authenticated user */
	userId: string;

	/** User email (if available) */
	email?: string;

	/** User role (if available) */
	userRole?: role;
}

/**
 * Supported OAuth providers.
 */
export type OAuthProvider = "github" | "google";

/**
 * Session information returned after successful authentication, including user details and tokens.
 */
export type AuthSession = {
	user: AuthResult;
	accessToken: string;
	refreshToken: string;
};
