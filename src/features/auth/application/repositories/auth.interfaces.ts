import type { AuthResult, AuthSession, OAuthProvider } from "../dto/Auth.type";

/**
 * Contract for authentication operations.
 *
 * This interface defines WHAT authentication actions are possible,
 * without exposing HOW they are implemented (e.g., Supabase).
 */
export interface IAuthRepository {
	/**
	 * Registers a new user using email and password.
	 *
	 * @throws Error if registration fails
	 */
	registerWithPassword(email: string, password: string): Promise<AuthResult>;

	/**
	 * Logs in an existing user using email and password.
	 *
	 * @throws Error if credentials are invalid
	 */
	loginWithPassword(email: string, password: string): Promise<AuthSession>;

	/**
	 * Sends a magic login link to the user's email.
	 *
	 * Note:
	 * - Does NOT authenticate immediately
	 * - User must click email link to complete login
	 */
	loginWithLink(email: string): Promise<void>;

	/**
	 * Initiates OAuth login (e.g., GitHub, Google).
	 *
	 * Note:
	 * - Usually triggers a redirect flow
	 * - Does NOT return authenticated user immediately
	 */
	loginWithOAuth(provider: OAuthProvider): Promise<void>;

	/**
	 * Returns the currently authenticated user, if any.
	 */
	getCurrentUser(): Promise<AuthResult | null>;

	/**
	 * Refreshes an expired access token using a valid refresh token.
	 */
	refreshSession(refreshToken: string): Promise<AuthSession>;

	/**
	 * Logs out the current user.
	 */
	logout(): Promise<void>;

	forgotPassword(email: string, redirectTo: string): Promise<void>;

	resetPassword(code: string, newPassword: string): Promise<void>;
}
