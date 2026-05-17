import { supabase } from "../../../../core/db/supabaseClient";
import { LessonRepositoryImpl } from "../../../lessons/infrastructure/db/lessonRepoImpl";
import { CreateLessonBlockUseCase } from "../../application/useCases/createLessonBlockUseCase.usecase";
import { GetLessonBlockUsecase } from "../../application/useCases/getLessonBlockUsecase.usecase";
import { GetBlocksByLessonIdUseCase } from "../../application/useCases/getBlocksByLessonIdUseCase";
import { GetBlocksPreviewUseCase } from "../../application/useCases/GetBlocksPreviewUseCase";
import { UpdateContentBlockUseCase } from "../../application/useCases/updateContentBlockUseCase";
import { LessonBlockFactory } from "../../domain/factories/lessonBlock.factory";
import { LessonBlockController } from "../../interfaces/controller/lessonBlock.controller";
import { LessonBlockRepoImpl } from "../db/LessonBlockRepoImpl";

export const useLessonBlockControllerFactory = (): LessonBlockController => {
	const lessonBlockRepository = new LessonBlockRepoImpl(supabase);
	const lessonRepository = new LessonRepositoryImpl(supabase);
	const lessonBlockFactory = new LessonBlockFactory();

	return new LessonBlockController({
		getLessonBlockById: new GetLessonBlockUsecase(lessonBlockRepository),
		getBlocksByLessonId: new GetBlocksByLessonIdUseCase(lessonBlockRepository),
		getBlocksPreview: new GetBlocksPreviewUseCase(lessonBlockRepository),
		createLessonBlock: new CreateLessonBlockUseCase(
			lessonBlockRepository,
			lessonRepository,
			lessonBlockFactory,
		),
		updateContent: new UpdateContentBlockUseCase(lessonBlockRepository),
	});
};
