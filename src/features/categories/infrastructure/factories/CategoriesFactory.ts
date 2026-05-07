import { CategoriesRepoImpl } from "./../db/CategoriesRepoImpl";
import { createCategoriesUseCase } from "../../application/useCases/createCategoriesUsecase";
import { supabase } from "../../../../core/db/supabaseClient";
import { CategoriesController } from "../../interfaces/controller/CategoriesController";
import { getAllCategoriesQueryUsecase } from "../../application/useCases/getAllCategoriesUsecase";
import { GetCategoriesWithModulesUseCase } from "../../application/useCases/getCategoriesWithModulesUseCase";
import { CategoriesQueryRepoImpl } from "../db/CategoriesQueryRepoImpl";

export function CategoriesFactory(): CategoriesController {
	const categoriesRepoImpl = new CategoriesRepoImpl(supabase);
	const categoriesQueryRepoImpl = new CategoriesQueryRepoImpl(supabase);
	const categoriesServices = {
		createCategoriesUseCase: new createCategoriesUseCase(categoriesRepoImpl),
		getAllCategoriesQuery: new getAllCategoriesQueryUsecase(categoriesQueryRepoImpl),
		getCategoriesWithModules: new GetCategoriesWithModulesUseCase(categoriesQueryRepoImpl),
	};
	return new CategoriesController(categoriesServices);
}
