import type { AssessmentBlockEntity } from "./AssessmentBlockEntity";
import type { ContentBlockEntity } from "./ContentBlockEntity";
import type { InteractiveBlockEntity } from "./InteractiveBlockEntity";

export type LessonBlockEntity =
	| ContentBlockEntity
	| InteractiveBlockEntity
	| AssessmentBlockEntity;
