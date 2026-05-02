import type {
	AssessmentEngine,
	InteractiveEngine,
} from "../types/LessionEngine.type";
import type { AssessmentBlockEntity } from "./AssessmentBlockEntity";
import type { ContentBlockEntity } from "./ContentBlockEntity";
import type { InteractiveBlockEntity } from "./InteractiveBlockEntity";

export type InteractiveBlockUnion = {
	[K in InteractiveEngine]: InteractiveBlockEntity<K>;
}[InteractiveEngine];

export type AssessmentBlockUnion = {
	[K in AssessmentEngine]: AssessmentBlockEntity<K>;
}[AssessmentEngine];

export type LessonBlockEntity =
	| ContentBlockEntity
	| InteractiveBlockUnion
	| AssessmentBlockUnion;
