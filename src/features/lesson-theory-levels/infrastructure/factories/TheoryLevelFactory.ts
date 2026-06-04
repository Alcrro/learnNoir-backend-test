import { TheoryLevelExplanationRepoImpl } from "../db/TheoryLevelExplanationRepoImpl.ts";
import { TheoryLevelAIService } from "../ai/TheoryLevelAIService.ts";
import { GetBlockExplanationsUseCase } from "../../application/useCases/GetBlockExplanationsUseCase.ts";
import { GetExplanationByLevelUseCase } from "../../application/useCases/GetExplanationByLevelUseCase.ts";
import { UpsertTeacherExplanationUseCase } from "../../application/useCases/UpsertTeacherExplanationUseCase.ts";
import { GenerateExplanationForTeacherUseCase } from "../../application/useCases/GenerateExplanationForTeacherUseCase.ts";
import { TheoryLevelExplanationController } from "../../interfaces/controllers/TheoryLevelExplanation.controller.ts";

export function createTheoryLevelController(): TheoryLevelExplanationController {
	const repo = new TheoryLevelExplanationRepoImpl();
	const aiService = new TheoryLevelAIService();

	const getBlockExplanations = new GetBlockExplanationsUseCase(repo);
	const getExplanationByLevel = new GetExplanationByLevelUseCase(repo, aiService);
	const upsertTeacherExplanation = new UpsertTeacherExplanationUseCase(repo);
	const generateForTeacher = new GenerateExplanationForTeacherUseCase(repo, aiService);

	return new TheoryLevelExplanationController(
		getBlockExplanations,
		getExplanationByLevel,
		upsertTeacherExplanation,
		generateForTeacher,
	);
}
