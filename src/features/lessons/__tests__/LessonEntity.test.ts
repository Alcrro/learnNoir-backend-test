import { describe, it, expect } from "vitest";
import { LessonEntity } from "../domain/entities/Lesson";

const base = { moduleId: "module-1", title: "Binary Search" };

describe("LessonEntity", () => {
	describe("constructor — validare", () => {
		it("creează o lecție validă cu parametri minimali", () => {
			const lesson = new LessonEntity(base);
			expect(lesson.moduleId).toBe("module-1");
			expect(lesson.title).toBe("Binary Search");
			expect(lesson.getStatus()).toBe("draft");
			expect(lesson.isActive).toBe(true);
			expect(lesson.durationSeconds).toBe(0);
			expect(lesson.gradeLevelId).toBeNull();
		});

		it("aruncă eroare dacă titlul are mai puțin de 3 caractere", () => {
			expect(() => new LessonEntity({ ...base, title: "AB" })).toThrow("Invalid title");
		});

		it("aruncă eroare dacă titlul este gol", () => {
			expect(() => new LessonEntity({ ...base, title: "" })).toThrow("Invalid title");
		});

		it("aruncă eroare dacă moduleId lipsește", () => {
			expect(() => new LessonEntity({ ...base, moduleId: "" })).toThrow("Module is required");
		});

		it("aruncă eroare dacă durationSeconds este negativ", () => {
			expect(() => new LessonEntity({ ...base, durationSeconds: -1 })).toThrow(
				"Duration must be a positive number",
			);
		});

		it("acceptă statusul furnizat explicit", () => {
			const lesson = new LessonEntity({ ...base, status: "published" });
			expect(lesson.getStatus()).toBe("published");
		});

		it("acceptă authors furnizați explicit", () => {
			const authors = [{ userId: "u1", role: "teacher" }];
			const lesson = new LessonEntity({ ...base, authors });
			expect(lesson.authors).toEqual(authors);
		});
	});

	describe("publish()", () => {
		it("setează statusul la published", () => {
			const lesson = new LessonEntity(base);
			lesson.publish();
			expect(lesson.getStatus()).toBe("published");
		});

		it("aruncă eroare dacă titlul este format doar din spații", () => {
			const lesson = new LessonEntity({ ...base, title: "ABC" });
			lesson.title = "   ";
			expect(() => lesson.publish()).toThrow("Lesson title is too short");
		});
	});

	describe("review()", () => {
		it("setează statusul la reviewed", () => {
			const lesson = new LessonEntity(base);
			lesson.review();
			expect(lesson.getStatus()).toBe("reviewed");
		});
	});

	describe("updateTitle()", () => {
		it("actualizează titlul și regenerează slug-ul", () => {
			const lesson = new LessonEntity(base);
			lesson.updateTitle("Merge Sort Algorithm");
			expect(lesson.title).toBe("Merge Sort Algorithm");
			expect(lesson.slug).toBe("merge-sort-algorithm");
		});

		it("aruncă eroare dacă noul titlu are mai puțin de 3 caractere", () => {
			const lesson = new LessonEntity(base);
			expect(() => lesson.updateTitle("AB")).toThrow("Title too short");
		});

		it("aruncă eroare dacă noul titlu este gol", () => {
			const lesson = new LessonEntity(base);
			expect(() => lesson.updateTitle("")).toThrow("Title too short");
		});
	});

	describe("generare slug", () => {
		it("transformă spațiile în cratime și lowercasează", () => {
			const lesson = new LessonEntity({ ...base, title: "Hello World" });
			expect(lesson.slug).toBe("hello-world");
		});

		it("elimină caracterele speciale", () => {
			const lesson = new LessonEntity({ ...base, title: "What is O(n)?" });
			expect(lesson.slug).toBe("what-is-o-n");
		});

		it("elimină cratimele de la început și sfârșit", () => {
			const lesson = new LessonEntity({ ...base, title: "---Hello---" });
			expect(lesson.slug).not.toMatch(/^-|-$/);
		});

		it("colapsează mai multe caractere speciale consecutive într-o singură cratimă", () => {
			const lesson = new LessonEntity({ ...base, title: "A + B == C" });
			expect(lesson.slug).toBe("a-b-c");
		});
	});
});
