import { z } from "zod";
import type {
	CreateLessonBlock as CreateLessonBlockDomain,
	LessonBlock as LessonBlockDomain,
} from "../../domain/types/LessionEngine.type";

const contentBlockDataSchema = z.object({
	content: z.array(z.record(z.string(), z.unknown())),
});

const interactiveBubbleSortDataSchema = z.object({
	initialArray: z.array(z.number()),
});

const interactiveFormulaDataSchema = z.object({
	formula: z.string().min(1),
});

const assessmentMcqDataSchema = z.object({
	question: z.string().min(1),
	options: z.array(z.string().min(1)).min(1),
	correctIndex: z.number().int().nonnegative(),
});

const assessmentInputDataSchema = z.object({
	question: z.string().min(1),
	correctAnswer: z.union([z.string().min(1), z.number()]),
});

const assessmentCodeDataSchema = z.object({
	question: z.string().min(1),
	correctCode: z.string().min(1),
});

const baseCreateLessonBlockSchema = z.object({
	lessonId: z.string().min(1),
	position: z.coerce.number().int().nonnegative().optional(),
});

const createContentLessonBlockSchema = baseCreateLessonBlockSchema.extend({
	type: z.literal("content"),
	data: contentBlockDataSchema,
});

const createInteractiveLessonBlockSchema = z.discriminatedUnion("engine", [
	baseCreateLessonBlockSchema.extend({
		type: z.literal("interactive"),
		engine: z.literal("algorithm:bubble-sort"),
		data: interactiveBubbleSortDataSchema,
	}),
	baseCreateLessonBlockSchema.extend({
		type: z.literal("interactive"),
		engine: z.literal("math:formula"),
		data: interactiveFormulaDataSchema,
	}),
]);

const createAssessmentLessonBlockSchema = z.discriminatedUnion("engine", [
	baseCreateLessonBlockSchema.extend({
		type: z.literal("assessment"),
		engine: z.literal("quiz:mcq"),
		data: assessmentMcqDataSchema,
	}),
	baseCreateLessonBlockSchema.extend({
		type: z.literal("assessment"),
		engine: z.literal("quiz:input"),
		data: assessmentInputDataSchema,
	}),
	baseCreateLessonBlockSchema.extend({
		type: z.literal("assessment"),
		engine: z.literal("quiz:code"),
		data: assessmentCodeDataSchema,
	}),
]);

const createLessonBlockSchemaInternal = z.discriminatedUnion("type", [
	createContentLessonBlockSchema,
	createInteractiveLessonBlockSchema,
	createAssessmentLessonBlockSchema,
]);

export const CreateLessonBlockSchema = z.preprocess(
	normalizeCreateLessonBlockPayload,
	createLessonBlockSchemaInternal,
);

export type CreateLessonBlockDTO = CreateLessonBlockDomain;
export type LessonBlock = LessonBlockDomain;

export function parseCreateLessonBlockDTO(
	input: unknown,
): CreateLessonBlockDTO {
	return CreateLessonBlockSchema.parse(input) as CreateLessonBlockDTO;
}

function normalizeCreateLessonBlockPayload(value: unknown): unknown {
	if (!isRecord(value)) {
		return value;
	}

	const normalized: Record<string, unknown> = { ...value };

	if (!("lessonId" in normalized) && "lesson_id" in normalized) {
		normalized.lessonId = normalized.lesson_id;
	}

	if (!("type" in normalized) && "blockType" in normalized) {
		normalized.type = normalized.blockType;
	}

	if (!("type" in normalized) && "block_type" in normalized) {
		normalized.type = normalized.block_type;
	}

	if (!("engine" in normalized) && "blockEngine" in normalized) {
		normalized.engine = normalized.blockEngine;
	}

	if (!("data" in normalized) && "blockData" in normalized) {
		normalized.data = normalized.blockData;
	}

	return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
