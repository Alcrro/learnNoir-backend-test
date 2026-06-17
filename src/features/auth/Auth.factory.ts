import { supabase } from "../../core/db/supabaseClient";
import { supabaseAuth } from "../../core/db/supabaseAuthClient";
import { ProfileRepoImpl } from "../profiles/infrastructures/db/ProfilesRepoImpl";
import { AuthWithCredentials } from "./application/useCases/authWithCredentials.usecase";
import { RegisterUserUseCase } from "./application/useCases/registerUser.usecase";
import { RefreshSessionUseCase } from "./application/useCases/refreshSession.usecase";
import { ForgotPasswordUseCase } from "./application/useCases/forgotPassword.usecase";
import { ResetPasswordUseCase } from "./application/useCases/resetPassword.usecase";
import { AuthRepositoryImpl } from "./infrastructure/db/AuthRepositoryImpl";
import { AuthController } from "./interfaces/controllers/Auth.controller";

export function authControllerFactory() {
	const authRepoImpl = new AuthRepositoryImpl(supabaseAuth, supabase);
	const registerRepoImpl = new ProfileRepoImpl(supabase);

	const authService = {
		registerUseCase: new RegisterUserUseCase(authRepoImpl, registerRepoImpl),
		authUseCase: new AuthWithCredentials(authRepoImpl),
		refreshUseCase: new RefreshSessionUseCase(authRepoImpl),
		forgotPasswordUseCase: new ForgotPasswordUseCase(authRepoImpl),
		resetPasswordUseCase: new ResetPasswordUseCase(authRepoImpl),
	};
	return new AuthController(authService);
}
