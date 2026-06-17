import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonRepositoryImpl } from "../../../lessons/infrastructure/db/lessonRepoImpl.ts";
import { LessonBlockRepoImpl } from "../../../lessons-block/infrastructure/db/LessonBlockRepoImpl.ts";
import { LessonTranslationAIService } from "../ai/LessonTranslationAIService.ts";
import { TranslateLessonUseCase } from "../../application/useCases/TranslateLessonUseCase.ts";
import { LessonTranslationController } from "../../interfaces/controller/LessonTranslationController.ts";

export function createLessonTranslationController(): LessonTranslationController {
	const lessonRepo = new LessonRepositoryImpl(supabase);
	const blockRepo = new LessonBlockRepoImpl(supabase);
	const aiService = new LessonTranslationAIService();
	const translateLesson = new TranslateLessonUseCase(lessonRepo, blockRepo, aiService);
	return new LessonTranslationController(translateLesson);
}
