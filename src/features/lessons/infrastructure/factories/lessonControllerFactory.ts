import { supabase } from "../../../../core/db/supabaseClient";
import { GetLesson } from "../../application/useCases/getLesson.usecase";
import { ListLessonsUseCase } from "../../application/useCases/listLessons.usecase";
import { ListLessonsByModuleIdUseCase } from "../../application/useCases/listLessonsByModuleId.usecase";
import { LessonController } from "../../interfaces/controller/Lessons.controller";
import { LessonRepositoryImpl } from "../db/lessonRepoImpl";
import { PublishLessonUseCase } from "../../application/useCases/publishLesson.usecase";
import { CreateLessonUseCase } from "../../application/useCases/createLesson.usecase";
import { DeleteLessonUseCase } from "../../application/useCases/deleteLesson.usecase";
import { ReviewLessonUseCase } from "../../application/useCases/reviewLesson.usecase";
import { UpdateLessonUseCase } from "../../application/useCases/updateLesson.usecase";
import { ListLessonsByModuleSlugUseCase } from "../../application/useCases/listLessonsByModuleSlug.usecase";

export function lessonControllerFactory(): LessonController {
	const lessonRepoImpl = new LessonRepositoryImpl(supabase);

	const lessonServices = {
		listLessonsUseCase: new ListLessonsUseCase(lessonRepoImpl),
		listLessonsByModuleIdUseCase: new ListLessonsByModuleIdUseCase(
			lessonRepoImpl,
		),
		listLessonsByModuleSlugUseCase: new ListLessonsByModuleSlugUseCase(
			lessonRepoImpl,
		),
		getLessonUseCase: new GetLesson(lessonRepoImpl),
		createLessonUseCase: new CreateLessonUseCase(lessonRepoImpl),
		updateLessonUseCase: new UpdateLessonUseCase(lessonRepoImpl),
		deleteLessonUseCase: new DeleteLessonUseCase(lessonRepoImpl),
		reviewLessonUseCase: new ReviewLessonUseCase(lessonRepoImpl),
		publishLessonUseCase: new PublishLessonUseCase(lessonRepoImpl),
	};
	return new LessonController(lessonServices);
}
