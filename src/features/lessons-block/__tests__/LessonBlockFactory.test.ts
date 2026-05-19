import { describe, it, expect } from "vitest";
import { LessonBlockFactory } from "../domain/factories/lessonBlock.factory";
import { ContentBlockEntity } from "../domain/entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../domain/entities/InteractiveBlockEntity";
import { AssessmentBlockEntity } from "../domain/entities/AssessmentBlockEntity";
import { BadRequestError } from "../../../utils/errors/DatabaseError";

const factory = new LessonBlockFactory();
const lessonId = "lesson-1";

describe("LessonBlockFactory", () => {
	it("creează ContentBlockEntity pentru type 'content'", () => {
		const block = factory.create({
			type: "content",
			lessonId,
			position: 0,
			data: { content: [] },
		});
		expect(block).toBeInstanceOf(ContentBlockEntity);
		expect(block.type).toBe("content");
	});

	it("creează InteractiveBlockEntity pentru type 'interactive'", () => {
		const block = factory.create({
			type: "interactive",
			lessonId,
			position: 1,
			engine: "algorithm:bubble-sort",
			data: { initialArray: [3, 1, 2] },
		});
		expect(block).toBeInstanceOf(InteractiveBlockEntity);
		expect(block.type).toBe("interactive");
	});

	it("creează AssessmentBlockEntity pentru type 'assessment'", () => {
		const block = factory.create({
			type: "assessment",
			lessonId,
			position: 2,
			engine: "quiz:mcq",
			data: { question: "Q?", options: ["A", "B"], correctIndex: 0 },
		});
		expect(block).toBeInstanceOf(AssessmentBlockEntity);
		expect(block.type).toBe("assessment");
	});

	it("aruncă BadRequestError pentru type necunoscut", () => {
		const invalidInput = { type: "unknown", lessonId, position: 0, data: {} };
		expect(() =>
			factory.create(invalidInput as unknown as Parameters<typeof factory.create>[0]),
		).toThrow(BadRequestError);
	});

	it("blok-ul creat are lessonId și position corecte", () => {
		const block = factory.create({
			type: "content",
			lessonId: "lesson-42",
			position: 7,
			data: { content: [] },
		});
		expect(block.lessonId).toBe("lesson-42");
		expect(block.position).toBe(7);
	});
});
