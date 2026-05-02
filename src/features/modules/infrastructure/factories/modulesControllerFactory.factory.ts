import { supabase } from "../../../../core/db/supabaseClient";
import { createModuleUsecase } from "../../application/useCases/createModuleUsecase";
import { getAllModulesUsecase } from "../../application/useCases/getAllModulesUsecase";
import { ModulesController } from "../../interfaces/http/controller/modules.controller";
import { ModulesRepoImpl } from "../db/ModulesRepoImpl";

export const useModulesControllerFactory = (): ModulesController => {
	// Implementation for creating modules controller

	const modulesRepoImpl = new ModulesRepoImpl(supabase); // You would replace this with an actual implementation of the repository
	const modulesServices = {
		createModulesUsecase: new createModuleUsecase(modulesRepoImpl), // You would replace this with an actual implementation of the use case
		getAllModulesUsecase: new getAllModulesUsecase(modulesRepoImpl), // You would replace this with an actual implementation of the use case
	};

	return new ModulesController(modulesServices);
};
