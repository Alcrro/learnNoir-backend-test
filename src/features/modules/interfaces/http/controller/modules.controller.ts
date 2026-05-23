import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../../utils/asyncHandlerMiddleware";
import type { createModuleUsecase } from "../../../application/useCases/createModuleUsecase";
import type { getAllModulesUsecase } from "../../../application/useCases/getAllModulesUsecase";

export class ModulesController {
	constructor(
		private readonly modulesServices: {
			createModulesUsecase: createModuleUsecase;
			getAllModulesUsecase: getAllModulesUsecase;
		},
	) {}

	create = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		await this.modulesServices.createModulesUsecase.execute(req.body);

		res.status(201).json({ data: null });
	});

	getAll = asyncHandlerMiddleware(async (_req: Request, res: Response) => {
		const result = await this.modulesServices.getAllModulesUsecase.execute();

		res.status(200).json({ data: result });
	});
}
