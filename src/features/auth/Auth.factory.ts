import { supabase } from "../../core/db/supabaseClient";
import { ProfileRepoImpl } from "../profiles/infrastructures/db/ProfilesRepoImpl";
import { AuthWithCredetials } from "./application/useCases/authWithCredentials.usecase";
import { RegisterUserUseCase } from "./application/useCases/registerUser.usecase";
import { AuthRepositoryImpl } from "./infrastructure/db/AuthRepositoryImpl";
import { AuthController } from "./interfaces/controllers/Auth.controller";

export function authControllerFactory() {
	const authRepoImpl = new AuthRepositoryImpl(supabase);
	const registerRepoImpl = new ProfileRepoImpl(supabase);

	const authService = {
		registerUseCase: new RegisterUserUseCase(authRepoImpl, registerRepoImpl),
		authUseCase: new AuthWithCredetials(authRepoImpl),
	};
	return new AuthController(authService);
}
