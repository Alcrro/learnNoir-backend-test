import { supabase } from "../../core/db/supabaseClient";
import { DeleteProfileUseCase } from "./application/useCase/DeleteProfile.usecase";
import { FindProfileUseCase } from "./application/useCase/FindProfile.usecase";
import { UpdateProfileUseCase } from "./application/useCase/UpdateProfile.usecase";
import { ProfileRepoImpl } from "./infrastructures/db/ProfilesRepoImpl";
import { ProfileController } from "./interfaces/controller/Profiles.controller";

export function profileControllerFactory(): ProfileController {
	// Here you can instantiate any dependencies required by the ProfileController
	const profileRepoImpl = new ProfileRepoImpl(supabase); // Example: you can create an instance of the repository here
	const profileServices = {
		findProfileUseCase: new FindProfileUseCase(profileRepoImpl), // Example: you can create instances of use cases here
		updateProfileUseCase: new UpdateProfileUseCase(profileRepoImpl),
		deleteProfileUseCase: new DeleteProfileUseCase(profileRepoImpl),
	}; // Example: you can create instances of services or repositories here
	return new ProfileController(profileServices);
}
