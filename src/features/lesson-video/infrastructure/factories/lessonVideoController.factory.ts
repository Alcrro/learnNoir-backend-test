import { supabase } from "../../../../core/db/supabaseClient.ts";
import { LessonVideoRepoImpl } from "../db/LessonVideoRepoImpl.ts";
import { StubVideoProvider } from "../ai/LessonVideoAIService.ts";
import { GetLessonVideoUseCase } from "../../application/useCases/getLessonVideoUseCase.ts";
import { GenerateLessonVideoUseCase } from "../../application/useCases/generateLessonVideoUseCase.ts";
import { LessonVideoController } from "../../interfaces/controller/lessonVideo.controller.ts";
import { LessonBlockRepoImpl } from "../../../lessons-block/infrastructure/db/LessonBlockRepoImpl.ts";

export const useLessonVideoControllerFactory = (): LessonVideoController => {
	const videoRepo = new LessonVideoRepoImpl(supabase);
	const blockRepo = new LessonBlockRepoImpl(supabase);
	// Înlocuiește StubVideoProvider cu implementarea reală când ai provider-ul (HeyGen, D-ID etc.)
	const provider = new StubVideoProvider();

	return new LessonVideoController({
		getVideo: new GetLessonVideoUseCase(videoRepo),
		generateVideo: new GenerateLessonVideoUseCase(videoRepo, blockRepo, provider, "stub"),
	});
};
