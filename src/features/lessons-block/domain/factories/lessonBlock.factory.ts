import { BadRequestError } from "../../../../utils/errors/DatabaseError";
import { AssessmentBlockEntity } from "../entities/AssessmentBlockEntity";
import { ContentBlockEntity } from "../entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../entities/InteractiveBlockEntity";
import type { LessonBlockEntity } from "../entities/LessonBlockEntity";
import type { CreateLessonBlock } from "../types/LessionEngine.type";

export class LessonBlockFactory {
	create(block: CreateLessonBlock & { position: number }): LessonBlockEntity {
		switch (block.type) {
			case "content":
				return new ContentBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					data: block.data,
				});

			case "interactive":
				return new InteractiveBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: block.engine,
					data: block.data,
				});

			case "assessment":
				return new AssessmentBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: block.engine,
					data: block.data,
				});

			default:
				throw new BadRequestError("Unsupported lesson block type");
		}
	}
}
