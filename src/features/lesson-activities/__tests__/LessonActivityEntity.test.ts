import { describe, it, expect } from "vitest";
import { LessonActivityEntity } from "../domain/entities/LessonActivityEntity";

const base = {
	lessonId: "lesson-1",
	type: "quiz" as const,
	title: "Quiz: Binary Search",
	weight: 1,
	required: true,
	position: 0,
};

describe("LessonActivityEntity", () => {
	describe("constructor — validare", () => {
		it("creează o entitate validă cu parametri corecți", () => {
			const entity = new LessonActivityEntity(base);
			expect(entity.lessonId).toBe("lesson-1");
			expect(entity.type).toBe("quiz");
			expect(entity.title).toBe("Quiz: Binary Search");
			expect(entity.weight).toBe(1);
			expect(entity.required).toBe(true);
			expect(entity.position).toBe(0);
		});

		it("aruncă eroare dacă lessonId este gol", () => {
			expect(() => new LessonActivityEntity({ ...base, lessonId: "  " })).toThrow(
				"LessonActivity must belong to a lesson",
			);
		});

		it("aruncă eroare dacă titlul este gol", () => {
			expect(() => new LessonActivityEntity({ ...base, title: "" })).toThrow(
				"LessonActivity title is required",
			);
		});

		it("aruncă eroare dacă titlul este doar spații", () => {
			expect(() => new LessonActivityEntity({ ...base, title: "   " })).toThrow(
				"LessonActivity title is required",
			);
		});

		it("aruncă eroare dacă weight este negativ", () => {
			expect(() => new LessonActivityEntity({ ...base, weight: -1 })).toThrow(
				"LessonActivity weight must be non-negative",
			);
		});

		it("aruncă eroare dacă position este negativ", () => {
			expect(() => new LessonActivityEntity({ ...base, position: -1 })).toThrow(
				"Invalid LessonActivity position",
			);
		});

		it("aruncă eroare dacă position este float", () => {
			expect(() => new LessonActivityEntity({ ...base, position: 1.5 })).toThrow(
				"Invalid LessonActivity position",
			);
		});

		it("trimează lessonId și titlul", () => {
			const entity = new LessonActivityEntity({
				...base,
				lessonId: "  lesson-1  ",
				title: "  Quiz  ",
			});
			expect(entity.lessonId).toBe("lesson-1");
			expect(entity.title).toBe("Quiz");
		});

		it("lessonBlockId și theoryInteractionId sunt null implicit", () => {
			const entity = new LessonActivityEntity(base);
			expect(entity.lessonBlockId).toBeNull();
			expect(entity.theoryInteractionId).toBeNull();
		});
	});

	describe("moveTo()", () => {
		it("actualizează poziția la o valoare validă", () => {
			const entity = new LessonActivityEntity(base);
			entity.moveTo(5);
			expect(entity.position).toBe(5);
		});

		it("acceptă poziția 0", () => {
			const entity = new LessonActivityEntity({ ...base, position: 3 });
			entity.moveTo(0);
			expect(entity.position).toBe(0);
		});

		it("aruncă eroare pentru poziție negativă", () => {
			const entity = new LessonActivityEntity(base);
			expect(() => entity.moveTo(-1)).toThrow("Invalid LessonActivity position");
		});

		it("aruncă eroare pentru float", () => {
			const entity = new LessonActivityEntity(base);
			expect(() => entity.moveTo(2.5)).toThrow("Invalid LessonActivity position");
		});
	});

	describe("toPrimitives()", () => {
		it("returnează un obiect simplu cu toate câmpurile", () => {
			const entity = new LessonActivityEntity(base);
			const primitives = entity.toPrimitives();
			expect(primitives).toMatchObject({
				lessonId: "lesson-1",
				type: "quiz",
				title: "Quiz: Binary Search",
				weight: 1,
				required: true,
				position: 0,
				lessonBlockId: null,
				theoryInteractionId: null,
			});
			expect(typeof primitives.id).toBe("string");
		});
	});

	describe("fromPrimitives()", () => {
		it("recreează entitatea din primitives", () => {
			const entity = new LessonActivityEntity(base);
			const primitives = entity.toPrimitives();
			const restored = LessonActivityEntity.fromPrimitives(primitives);
			expect(restored.id).toBe(entity.id);
			expect(restored.title).toBe(entity.title);
			expect(restored.position).toBe(entity.position);
		});
	});
});
