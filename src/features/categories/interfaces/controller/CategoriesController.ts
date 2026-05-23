import { createCategoriesUseCase } from "./../../application/useCases/createCategoriesUsecase";
import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { getAllCategoriesQueryUsecase } from "../../application/useCases/getAllCategoriesUsecase";
import type { GetCategoriesWithModulesUseCase } from "../../application/useCases/getCategoriesWithModulesUseCase";

export class CategoriesController {
	constructor(
		private readonly categoriesServices: {
			createCategoriesUseCase: createCategoriesUseCase;
			getAllCategoriesQuery: getAllCategoriesQueryUsecase;
			getCategoriesWithModules: GetCategoriesWithModulesUseCase;
		},
	) {}

	create = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		await this.categoriesServices.createCategoriesUseCase.execute(req.body);

		res.status(201).json({ data: null });
	});

	getAllCategoriesQuery = asyncHandlerMiddleware(
		async (_req: Request, res: Response) => {
			const result = await this.categoriesServices.getAllCategoriesQuery.execute();

			res.status(200).json({ data: result });
		},
	);

	getCategoriesWithModules = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const { slug } = req.params as { slug: string };
			const result = await this.categoriesServices.getCategoriesWithModules.execute(slug);

			res.status(200).json({ data: result });
		},
	);
}
