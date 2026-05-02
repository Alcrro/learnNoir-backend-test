import { BadRequestError } from "../../../../utils/errors/DatabaseError";
import { AssessmentBlockEntity } from "../entities/AssessmentBlockEntity";
import { ContentBlockEntity } from "../entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../entities/InteractiveBlockEntity";
import type { LessonBlockEntity } from "../entities/LessonBlockEntity";
import type {
	CreateAssessmentLessonBlockUnion,
	CreateContentLessonBlock,
	CreateInteractiveLessonBlockUnion,
	CreateLessonBlock,
} from "../types/LessionEngine.type";

export class LessonBlockFactory {
	create(block: CreateLessonBlock & { position: number }): LessonBlockEntity {
		switch (block.type) {
			case "content":
				return this.createContentBlock(block);
			case "interactive":
				return this.createInteractiveBlock(block);
			case "assessment":
				return this.createAssessmentBlock(block);
		}
	}

	private createContentBlock(
		block: CreateContentLessonBlock & { position: number },
	): LessonBlockEntity {
		return new ContentBlockEntity({
			lessonId: block.lessonId,
			position: block.position,
			data: block.data,
		});
	}

	private createInteractiveBlock(
		block: CreateInteractiveLessonBlockUnion & { position: number },
	): LessonBlockEntity {
		switch (block.engine) {
			case "algorithm:bubble-sort":
				return new InteractiveBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: "algorithm:bubble-sort",
					data: block.data,
				});
			case "math:formula":
				return new InteractiveBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: "math:formula",
					data: block.data,
				});
			default:
				throw new BadRequestError("Unsupported interactive lesson block engine");
		}
	}

	private createAssessmentBlock(
		block: CreateAssessmentLessonBlockUnion & { position: number },
	): LessonBlockEntity {
		switch (block.engine) {
			case "quiz:mcq":
				return new AssessmentBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: "quiz:mcq",
					data: block.data,
				});
			case "quiz:input":
				return new AssessmentBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: "quiz:input",
					data: block.data,
				});
			case "quiz:code":
				return new AssessmentBlockEntity({
					lessonId: block.lessonId,
					position: block.position,
					engine: "quiz:code",
					data: block.data,
				});
			default:
				throw new BadRequestError("Unsupported assessment lesson block engine");
		}
	}
}
