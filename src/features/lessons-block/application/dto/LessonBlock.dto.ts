import { z } from "zod";
import type {
	CreateLessonBlock as CreateLessonBlockDomain,
	LessonBlock as LessonBlockDomain,
} from "../../domain/types/LessionEngine.type";

const contentBlockDataSchema = z.object({
	content: z.array(z.record(z.string(), z.unknown())),
});

// Known interactive engine schemas — strict validation for known engines
const interactiveBubbleSortSchema = z.object({
	type: z.literal("interactive"),
	engine: z.literal("algorithm:bubble-sort"),
	data: z.object({ initialArray: z.array(z.number()) }),
});

const interactiveFormulaSchema = z.object({
	type: z.literal("interactive"),
	engine: z.literal("math:formula"),
	data: z.object({ formula: z.string().min(1) }),
});

// Known assessment engine schemas
const assessmentMcqSchema = z.object({
	type: z.literal("assessment"),
	engine: z.literal("quiz:mcq"),
	data: z.object({
		question: z.string().min(1),
		options: z.array(z.string().min(1)).min(1),
		correctIndex: z.number().int().nonnegative(),
	}),
});

const assessmentInputSchema = z.object({
	type: z.literal("assessment"),
	engine: z.literal("quiz:input"),
	data: z.object({
		question: z.string().min(1),
		correctAnswer: z.union([z.string().min(1), z.number()]),
	}),
});

const assessmentCodeSchema = z.object({
	type: z.literal("assessment"),
	engine: z.literal("quiz:code"),
	data: z.object({
		question: z.string().min(1),
		correctCode: z.string().min(1),
	}),
});

const baseCreateLessonBlockSchema = z.object({
	lessonId: z.string().min(1),
	position: z.coerce.number().int().nonnegative().optional(),
});

const createContentLessonBlockSchema = baseCreateLessonBlockSchema.extend({
	type: z.literal("content"),
	data: contentBlockDataSchema,
});

// Unknown engine fallback — any engine with flexible data passes through
const interactiveUnknownSchema = baseCreateLessonBlockSchema.extend({
	type: z.literal("interactive"),
	engine: z.string().min(1),
	data: z.record(z.string(), z.unknown()),
});

const assessmentUnknownSchema = baseCreateLessonBlockSchema.extend({
	type: z.literal("assessment"),
	engine: z.string().min(1),
	data: z.record(z.string(), z.unknown()),
});

// Known engines are validated strictly; unknown engines fall through to the generic schema
const createInteractiveLessonBlockSchema = z.union([
	baseCreateLessonBlockSchema.merge(interactiveBubbleSortSchema),
	baseCreateLessonBlockSchema.merge(interactiveFormulaSchema),
	interactiveUnknownSchema,
]);

const createAssessmentLessonBlockSchema = z.union([
	baseCreateLessonBlockSchema.merge(assessmentMcqSchema),
	baseCreateLessonBlockSchema.merge(assessmentInputSchema),
	baseCreateLessonBlockSchema.merge(assessmentCodeSchema),
	assessmentUnknownSchema,
]);

const createLessonBlockSchemaInternal = z.union([
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
