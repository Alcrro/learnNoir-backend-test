import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonVersionRepoImpl } from "../db/LessonVersionRepoImpl.ts";
import { CreateLessonVersionUseCase } from "../../application/useCases/createLessonVersion.usecase.ts";
import { ListLessonVersionsUseCase } from "../../application/useCases/listLessonVersions.usecase.ts";
import { GetLessonVersionUseCase } from "../../application/useCases/getLessonVersion.usecase.ts";
import { PublishLessonVersionUseCase } from "../../application/useCases/publishLessonVersion.usecase.ts";
import { LessonVersionController } from "../../interfaces/controller/LessonVersion.controller.ts";

export function lessonVersionControllerFactory(): LessonVersionController {
	const repo = new LessonVersionRepoImpl(supabase);

	return new LessonVersionController({
		create: new CreateLessonVersionUseCase(repo),
		list: new ListLessonVersionsUseCase(repo),
		get: new GetLessonVersionUseCase(repo),
		publish: new PublishLessonVersionUseCase(repo),
	});
}
