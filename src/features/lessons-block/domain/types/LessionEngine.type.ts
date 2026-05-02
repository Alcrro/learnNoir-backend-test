import type { LessonContentNode } from "../../../lessons-content/domain/types/LessonContent.type";

// Known engine data shapes — for documentation and typed helpers only.
// Adding a new engine for any subject does NOT require changing this file.
export type KnownInteractiveEngines = {
	"algorithm:bubble-sort": { initialArray: number[] };
	"math:formula": { formula: string };
};

export type KnownAssessmentEngines = {
	"quiz:mcq": { question: string; options: string[]; correctIndex: number };
	"quiz:input": { question: string; correctAnswer: string | number };
	"quiz:code": { question: string; correctCode: string };
};

export type InteractiveEngine = string;
export type AssessmentEngine = string;

export type BlockPayload = Record<string, unknown>;

export type ContentBlockData = {
	content: LessonContentNode[];
};

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

export type InteractiveLessonBlock = PersistedLessonBlockBase & {
	type: "interactive";
	engine: string;
	data: BlockPayload;
};

export type AssessmentLessonBlock = PersistedLessonBlockBase & {
	type: "assessment";
	engine: string;
	data: BlockPayload;
};

export type LessonBlock =
	| ContentLessonBlock
	| InteractiveLessonBlock
	| AssessmentLessonBlock;

export type CreateContentLessonBlock = CreateLessonBlockBase & {
	type: "content";
	data: ContentBlockData;
};

export type CreateInteractiveLessonBlock = CreateLessonBlockBase & {
	type: "interactive";
	engine: string;
	data: BlockPayload;
};

export type CreateAssessmentLessonBlock = CreateLessonBlockBase & {
	type: "assessment";
	engine: string;
	data: BlockPayload;
};

export type CreateLessonBlock =
	| CreateContentLessonBlock
	| CreateInteractiveLessonBlock
	| CreateAssessmentLessonBlock;
