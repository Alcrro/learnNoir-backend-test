import { describe, it, expect } from "vitest";
import { ContentBlockEntity } from "../domain/entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../domain/entities/InteractiveBlockEntity";
import { AssessmentBlockEntity } from "../domain/entities/AssessmentBlockEntity";

const lessonId = "lesson-1";
const contentData = { content: [] };

describe("BaseBlockEntity (prin ContentBlockEntity)", () => {
	it("aruncă eroare dacă lessonId este gol", () => {
		expect(
			() => new ContentBlockEntity({ lessonId: "", position: 0, data: contentData }),
		).toThrow("Lesson block must belong to a lesson");
	});

	it("aruncă eroare dacă lessonId este doar spații", () => {
		expect(
			() => new ContentBlockEntity({ lessonId: "   ", position: 0, data: contentData }),
		).toThrow("Lesson block must belong to a lesson");
	});

	it("aruncă eroare dacă position este negativă", () => {
		expect(
			() => new ContentBlockEntity({ lessonId, position: -1, data: contentData }),
		).toThrow("Invalid lesson block position");
	});

	it("aruncă eroare dacă position este float", () => {
		expect(
			() => new ContentBlockEntity({ lessonId, position: 1.5, data: contentData }),
		).toThrow("Invalid lesson block position");
	});

	it("moveTo() actualizează poziția la o valoare validă", () => {
		const block = new ContentBlockEntity({ lessonId, position: 0, data: contentData });
		block.moveTo(5);
		expect(block.position).toBe(5);
	});

	it("moveTo() aruncă eroare pentru poziție invalidă", () => {
		const block = new ContentBlockEntity({ lessonId, position: 0, data: contentData });
		expect(() => block.moveTo(-1)).toThrow("Invalid lesson block position");
	});
});

describe("ContentBlockEntity", () => {
	it("type este întotdeauna 'content'", () => {
		const block = new ContentBlockEntity({ lessonId, position: 0, data: contentData });
		expect(block.type).toBe("content");
	});

	it("aruncă eroare dacă data lipsește", () => {
		expect(
			() => new ContentBlockEntity({ lessonId, position: 0, data: null as never }),
		).toThrow("Content data is required");
	});

	it("update() înlocuiește data", () => {
		const block = new ContentBlockEntity({ lessonId, position: 0, data: contentData });
		const newData = { content: [{ type: "paragraph", text: "Hello" }] } as never;
		block.update(newData);
		expect(block.getData()).toEqual(newData);
	});

	it("toPrimitives() returnează obiect complet", () => {
		const block = new ContentBlockEntity({ lessonId, position: 2, data: contentData });
		const p = block.toPrimitives();
		expect(p.type).toBe("content");
		expect(p.lessonId).toBe(lessonId);
		expect(p.position).toBe(2);
		expect(p.data).toEqual(contentData);
		expect(typeof p.id).toBe("string");
	});

	it("fromPrimitives() recreează entitatea", () => {
		const block = new ContentBlockEntity({ lessonId, position: 0, data: contentData });
		const p = block.toPrimitives();
		const restored = ContentBlockEntity.fromPrimitives(p);
		expect(restored.id).toBe(block.id);
		expect(restored.lessonId).toBe(lessonId);
	});
});

describe("InteractiveBlockEntity", () => {
	const engine = "algorithm:bubble-sort";
	const data = { initialArray: [3, 1, 2] };

	it("type este întotdeauna 'interactive'", () => {
		const block = new InteractiveBlockEntity({ lessonId, position: 0, engine, data });
		expect(block.type).toBe("interactive");
	});

	it("aruncă eroare dacă engine lipsește", () => {
		expect(
			() => new InteractiveBlockEntity({ lessonId, position: 0, engine: "", data }),
		).toThrow("Interactive block requires an engine");
	});

	it("aruncă eroare dacă engine este doar spații", () => {
		expect(
			() => new InteractiveBlockEntity({ lessonId, position: 0, engine: "   ", data }),
		).toThrow("Interactive block requires an engine");
	});

	it("getEngine() returnează engine-ul setat", () => {
		const block = new InteractiveBlockEntity({ lessonId, position: 0, engine, data });
		expect(block.getEngine()).toBe(engine);
	});

	it("update() modifică engine și data", () => {
		const block = new InteractiveBlockEntity({ lessonId, position: 0, engine, data });
		block.update("math:formula", { formula: "E=mc^2" });
		expect(block.getEngine()).toBe("math:formula");
		expect(block.getData()).toEqual({ formula: "E=mc^2" });
	});

	it("toPrimitives() returnează obiect complet", () => {
		const block = new InteractiveBlockEntity({ lessonId, position: 1, engine, data });
		const p = block.toPrimitives();
		expect(p.type).toBe("interactive");
		expect(p.engine).toBe(engine);
		expect(p.data).toEqual(data);
	});

	it("fromPrimitives() recreează entitatea", () => {
		const block = new InteractiveBlockEntity({ lessonId, position: 0, engine, data });
		const restored = InteractiveBlockEntity.fromPrimitives(block.toPrimitives());
		expect(restored.id).toBe(block.id);
		expect(restored.getEngine()).toBe(engine);
	});
});

describe("AssessmentBlockEntity", () => {
	const engine = "quiz:mcq";
	const data = { question: "Ce este O(n)?", options: ["Liniar", "Pătratic"], correctIndex: 0 };

	it("type este întotdeauna 'assessment'", () => {
		const block = new AssessmentBlockEntity({ lessonId, position: 0, engine, data });
		expect(block.type).toBe("assessment");
	});

	it("aruncă eroare dacă engine lipsește", () => {
		expect(
			() => new AssessmentBlockEntity({ lessonId, position: 0, engine: "", data }),
		).toThrow("Assessment block requires an engine");
	});

	it("getEngine() returnează engine-ul setat", () => {
		const block = new AssessmentBlockEntity({ lessonId, position: 0, engine, data });
		expect(block.getEngine()).toBe(engine);
	});

	it("update() modifică engine și data", () => {
		const block = new AssessmentBlockEntity({ lessonId, position: 0, engine, data });
		block.update("quiz:input", { question: "Definiți recursivitatea", correctAnswer: "..." });
		expect(block.getEngine()).toBe("quiz:input");
	});

	it("toPrimitives() returnează obiect complet", () => {
		const block = new AssessmentBlockEntity({ lessonId, position: 3, engine, data });
		const p = block.toPrimitives();
		expect(p.type).toBe("assessment");
		expect(p.engine).toBe(engine);
		expect(p.position).toBe(3);
	});

	it("fromPrimitives() recreează entitatea", () => {
		const block = new AssessmentBlockEntity({ lessonId, position: 0, engine, data });
		const restored = AssessmentBlockEntity.fromPrimitives(block.toPrimitives());
		expect(restored.id).toBe(block.id);
		expect(restored.getEngine()).toBe(engine);
	});
});
