import { supabase } from "../../core/db/supabaseClient";
import { supabaseAuth } from "../../core/db/supabaseAuthClient";
import { ProfileRepoImpl } from "../profiles/infrastructures/db/ProfilesRepoImpl";
import { AuthWithCredetials } from "./application/useCases/authWithCredentials.usecase";
import { RegisterUserUseCase } from "./application/useCases/registerUser.usecase";
import { AuthRepositoryImpl } from "./infrastructure/db/AuthRepositoryImpl";
import { AuthController } from "./interfaces/controllers/Auth.controller";

export function authControllerFactory() {
	// Use the anon-key client for sign-up / sign-in so that setting the auth
	// session never pollutes the service-role client used for DB writes.
	const authRepoImpl = new AuthRepositoryImpl(supabaseAuth);
	const registerRepoImpl = new ProfileRepoImpl(supabase);

	const authService = {
		registerUseCase: new RegisterUserUseCase(authRepoImpl, registerRepoImpl),
		authUseCase: new AuthWithCredetials(authRepoImpl),
	};
	return new AuthController(authService);
}
