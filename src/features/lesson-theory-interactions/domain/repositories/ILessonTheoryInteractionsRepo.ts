import type {
	LessonTheoryInteraction,
	TheoryInteractionComponentType,
	TheoryInteractionContent,
} from "../types/LessonTheoryInteraction.type.ts";

export interface ILessonTheoryInteractionsRepo {
	/** Latest approved per component — used by students */
	getApprovedByLesson(lessonId: string): Promise<LessonTheoryInteraction[]>;

	/** All versions for a lesson — used by teachers */
	getAllByLesson(lessonId: string): Promise<LessonTheoryInteraction[]>;

	findById(id: string): Promise<LessonTheoryInteraction | null>;

	create(data: {
		lessonId: string;
		componentType: TheoryInteractionComponentType;
		content: TheoryInteractionContent;
		version: number;
		createdBy: string | null;
	}): Promise<LessonTheoryInteraction>;

	updateContent(id: string, content: TheoryInteractionContent): Promise<LessonTheoryInteraction>;

	approve(id: string): Promise<LessonTheoryInteraction>;
}
