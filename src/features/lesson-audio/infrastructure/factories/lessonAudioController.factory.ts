import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonAudioRepoImpl } from "../db/LessonAudioRepoImpl.ts";
import { LessonAudioAIService } from "../ai/LessonAudioAIService.ts";
import { SupabaseAudioStorage } from "../storage/SupabaseAudioStorage.ts";
import { GetLessonAudioUseCase } from "../../application/useCases/getLessonAudioUseCase.ts";
import { GenerateLessonAudioUseCase } from "../../application/useCases/generateLessonAudioUseCase.ts";
import { LessonAudioController } from "../../interfaces/controller/lessonAudio.controller.ts";
import { LessonBlockRepoImpl } from "../../../lessons-block/infrastructure/db/LessonBlockRepoImpl.ts";

export const useLessonAudioControllerFactory = (): LessonAudioController => {
	const audioRepo = new LessonAudioRepoImpl(supabase);
	const blockRepo = new LessonBlockRepoImpl(supabase);
	const aiService = new LessonAudioAIService();
	const storage = new SupabaseAudioStorage(supabase);

	return new LessonAudioController({
		getAudio: new GetLessonAudioUseCase(audioRepo),
		generateAudio: new GenerateLessonAudioUseCase(audioRepo, blockRepo, aiService, storage),
	});
};
