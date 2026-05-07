import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonRepositoryImpl } from "../../../lessons/infrastructure/db/lessonRepoImpl.ts";
import { CreateLessonActivityUseCase } from "../../application/useCases/createLessonActivityUseCase.usecase.ts";
import { DeleteLessonActivityUseCase } from "../../application/useCases/deleteLessonActivityUseCase.usecase.ts";
import { GetLessonActivitiesByLessonUseCase } from "../../application/useCases/getLessonActivitiesByLessonUseCase.usecase.ts";
import { GetLessonActivityUseCase } from "../../application/useCases/getLessonActivityUseCase.usecase.ts";
import { ReorderLessonActivityUseCase } from "../../application/useCases/reorderLessonActivityUseCase.usecase.ts";
import { LessonActivityController } from "../../interfaces/controller/lessonActivity.controller.ts";
import { LessonActivityRepoImpl } from "../db/LessonActivityRepoImpl.ts";

export const useLessonActivityControllerFactory =
	(): LessonActivityController => {
		const activityRepo = new LessonActivityRepoImpl(supabase);
		const lessonRepo = new LessonRepositoryImpl(supabase);

		return new LessonActivityController({
			createLessonActivity: new CreateLessonActivityUseCase(
				activityRepo,
				lessonRepo,
			),
			getLessonActivity: new GetLessonActivityUseCase(activityRepo),
			getLessonActivitiesByLesson: new GetLessonActivitiesByLessonUseCase(
				activityRepo,
			),
			deleteLessonActivity: new DeleteLessonActivityUseCase(activityRepo),
			reorderLessonActivity: new ReorderLessonActivityUseCase(activityRepo),
		});
	};
