import { SubjectsController } from "../../interfaces/controller/SubjectsController";
import { createSubjectUsecase } from "../../application/useCases/createSubjectUsecase";
import { SubjectsRepoImpl } from "../db/SubjectsRepoImpl";
import { supabase } from "../../../../core/db/supabaseClient";
import { getSubjectQueryStatsUsecase } from "../../application/useCases/getSubjectsStatsUsecase";
import { SubjectQueryRepositoryImpl } from "../db/SubjectQueryRepositoryImpl";

export function subjectFactory(): SubjectsController {
	const subjectQueryRepositoryImpl = new SubjectQueryRepositoryImpl(supabase);
	const subjectRepositoryImpl = new SubjectsRepoImpl(supabase);
	const subjectsServices = {
		createSubjectUsecase: new createSubjectUsecase(subjectRepositoryImpl),
		getSubjectQueryStatsUsecase: new getSubjectQueryStatsUsecase(
			subjectQueryRepositoryImpl,
		),
	};

	return new SubjectsController(subjectsServices);
}
