import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import { createSubjectUsecase } from "../../application/useCases/createSubjectUsecase";
import type { getSubjectQueryStatsUsecase } from "../../application/useCases/getSubjectsStatsUsecase";
import { BadRequestError } from "../../../../utils/errors/DatabaseError";

export class SubjectsController {
	constructor(
		private readonly subjectsService: {
			createSubjectUsecase: createSubjectUsecase;
			getSubjectQueryStatsUsecase: getSubjectQueryStatsUsecase;
		},
	) {
		// Initialize any dependencies or services needed for the controller
	}

	createSubject = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const newSubject = await this.subjectsService.createSubjectUsecase.execute(
			req.body,
		);

		res.status(201).json(newSubject);
	});

	getSubjectsStats = asyncHandlerMiddleware(
		async (req: Request, res: Response) => {
			const rawLimit = req.query.limit;
			let limit: number | undefined;

			if (typeof rawLimit === "string") {
				limit = Number(rawLimit);
			}

			if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
				throw new BadRequestError("Query param `limit` must be a positive integer");
			}

			const params = limit === undefined ? {} : { limit };
			const result =
				await this.subjectsService.getSubjectQueryStatsUsecase.execute(params);

			res.status(200).json({ success: true, data: result });
		},
	);
}
