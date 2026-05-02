import type { LessonContentNode } from "../../../lessons-content/domain/types/LessonContent.type";

export type ContentBlockData = {
	content: LessonContentNode[];
};

export type InteractiveBlockDataMap = {
	"algorithm:bubble-sort": {
		initialArray: number[];
	};
	"math:formula": {
		formula: string;
	};
};

export type AssessmentBlockDataMap = {
	"quiz:mcq": {
		question: string;
		options: string[];
		correctIndex: number;
	};
	"quiz:input": {
		question: string;
		correctAnswer: string | number;
	};
	"quiz:code": {
		question: string;
		correctCode: string;
	};
};

export type InteractiveEngine = keyof InteractiveBlockDataMap;
export type AssessmentEngine = keyof AssessmentBlockDataMap;

type PersistedLessonBlockBase = {
	id: string;
	lessonId: string;
	position: number;
};

type CreateLessonBlockBase = {
	lessonId: string;
	position?: number;
};

export type ContentLessonBlock = PersistedLessonBlockBase & {
	type: "content";
	data: ContentBlockData;
};

export type InteractiveLessonBlock<T extends InteractiveEngine> =
	PersistedLessonBlockBase & {
		type: "interactive";
		engine: T;
		data: InteractiveBlockDataMap[T];
	};

export type AssessmentLessonBlock<T extends AssessmentEngine> =
	PersistedLessonBlockBase & {
		type: "assessment";
		engine: T;
		data: AssessmentBlockDataMap[T];
	};

export type InteractiveLessonBlockUnion = {
	[K in InteractiveEngine]: InteractiveLessonBlock<K>;
}[InteractiveEngine];

export type AssessmentLessonBlockUnion = {
	[K in AssessmentEngine]: AssessmentLessonBlock<K>;
}[AssessmentEngine];

export type LessonBlock =
	| ContentLessonBlock
	| InteractiveLessonBlockUnion
	| AssessmentLessonBlockUnion;

export type CreateContentLessonBlock = CreateLessonBlockBase & {
	type: "content";
	data: ContentBlockData;
};

export type CreateInteractiveLessonBlock<T extends InteractiveEngine> =
	CreateLessonBlockBase & {
		type: "interactive";
		engine: T;
		data: InteractiveBlockDataMap[T];
	};

export type CreateAssessmentLessonBlock<T extends AssessmentEngine> =
	CreateLessonBlockBase & {
		type: "assessment";
		engine: T;
		data: AssessmentBlockDataMap[T];
	};

export type CreateInteractiveLessonBlockUnion = {
	[K in InteractiveEngine]: CreateInteractiveLessonBlock<K>;
}[InteractiveEngine];

export type CreateAssessmentLessonBlockUnion = {
	[K in AssessmentEngine]: CreateAssessmentLessonBlock<K>;
}[AssessmentEngine];

export type CreateLessonBlock =
	| CreateContentLessonBlock
	| CreateInteractiveLessonBlockUnion
	| CreateAssessmentLessonBlockUnion;
