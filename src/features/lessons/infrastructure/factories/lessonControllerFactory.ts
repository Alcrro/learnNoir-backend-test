import { supabase } from "../../../../core/db/supabaseClient";
import { GetLesson } from "../../application/useCases/getLesson.usecase";
import { ListLessonsUseCase } from "../../application/useCases/listLessons.usecase";
import { ListLessonsByModuleIdUseCase } from "../../application/useCases/listLessonsByModuleId.usecase";
import { LessonController } from "../../interfaces/controller/Lessons.controller";
import { LessonRepositoryImpl } from "../db/lessonRepoImpl";
import { ModulesRepoImpl } from "../../../modules/infrastructure/db/ModulesRepoImpl";
import { LessonQueryRepositoryImpl } from "../db/lessonQueryRepoImpl";
import { PublishLessonUseCase } from "../../application/useCases/publishLesson.usecase";
import { CreateLessonUseCase } from "../../application/useCases/createLesson.usecase";
import { DeleteLessonUseCase } from "../../application/useCases/deleteLesson.usecase";
import { ReviewLessonUseCase } from "../../application/useCases/reviewLesson.usecase";
import { UpdateLessonUseCase } from "../../application/useCases/updateLesson.usecase";
import { ListLessonsByModuleSlugUseCase } from "../../application/useCases/listLessonsByModuleSlug.usecase";
import { ListTeacherLessonsUseCase } from "../../application/useCases/listTeacherLessons.usecase";
import { GetTeacherStatsUseCase } from "../../application/useCases/getTeacherStats.usecase";
import { GetTeacherStudentsUseCase } from "../../application/useCases/getTeacherStudents.usecase";
import { GetLessonBySlugUseCase } from "../../application/useCases/getLessonBySlug.usecase";
import { GetLessonHistoryUseCase } from "../../application/useCases/getLessonHistory.usecase";
import { GenerateBlocksFromTextUseCase } from "../../application/useCases/generateBlocksFromText.usecase";
import { LessonAIService } from "../ai/lessonAI.service";
import { LessonBlockRepoImpl } from "../../../lessons-block/infrastructure/db/LessonBlockRepoImpl";
import { CacheService } from "../cache/cache.service";
import { redis } from "../../../../core/cache/redis";

export function lessonControllerFactory(): LessonController {
	const lessonRepo = new LessonRepositoryImpl(supabase);
	const moduleRepo = new ModulesRepoImpl(supabase);
	const lessonQueryRepo = new LessonQueryRepositoryImpl(supabase);
	const blockRepoImpl = new LessonBlockRepoImpl(supabase);
	const aiService = new LessonAIService(new CacheService(redis));

	const lessonServices = {
		listLessonsUseCase: new ListLessonsUseCase(lessonRepo),
		listLessonsByModuleIdUseCase: new ListLessonsByModuleIdUseCase(lessonRepo),
		listLessonsByModuleSlugUseCase: new ListLessonsByModuleSlugUseCase(moduleRepo, lessonRepo),
		getLessonUseCase: new GetLesson(lessonRepo),
		getLessonBySlugUseCase: new GetLessonBySlugUseCase(lessonRepo),
		createLessonUseCase: new CreateLessonUseCase(lessonRepo),
		updateLessonUseCase: new UpdateLessonUseCase(lessonRepo),
		deleteLessonUseCase: new DeleteLessonUseCase(lessonRepo),
		reviewLessonUseCase: new ReviewLessonUseCase(lessonRepo),
		publishLessonUseCase: new PublishLessonUseCase(lessonRepo),
		listTeacherLessonsUseCase: new ListTeacherLessonsUseCase(lessonQueryRepo),
		getTeacherStatsUseCase: new GetTeacherStatsUseCase(lessonQueryRepo),
		getTeacherStudentsUseCase: new GetTeacherStudentsUseCase(lessonQueryRepo),
		getLessonHistoryUseCase: new GetLessonHistoryUseCase(lessonQueryRepo),
		generateBlocksFromTextUseCase: new GenerateBlocksFromTextUseCase(aiService, blockRepoImpl, lessonRepo),
	};
	return new LessonController(lessonServices);
}
