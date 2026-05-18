import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateLessonUseCase } from "../application/useCases/updateLesson.usecase";
import { LessonEntity } from "../domain/entities/Lesson";
import { ForbiddenError } from "../../../utils/errors/DatabaseError";

const makeLessonRepo = () => ({
	get: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	publish: vi.fn(),
	review: vi.fn(),
	list: vi.fn(),
	listByModuleId: vi.fn(),
	listByModuleSlug: vi.fn(),
	getBySlug: vi.fn(),
	logEdit: vi.fn(),
});

const makeLessonWithAuthor = (authorId: string) =>
	new LessonEntity({
		moduleId: "module-1",
		title: "Binary Search",
		authors: [{ userId: authorId, role: "teacher" }],
	});

describe("UpdateLessonUseCase", () => {
	let repo: ReturnType<typeof makeLessonRepo>;
	let useCase: UpdateLessonUseCase;

	beforeEach(() => {
		repo = makeLessonRepo();
		useCase = new UpdateLessonUseCase(repo);
	});

	it("admin poate actualiza orice lecție fără a fi autor", async () => {
		const lesson = makeLessonWithAuthor("other-user");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);

		await expect(
			useCase.execute("lesson-1", { title: "New Title Here" }, "admin-user", "admin"),
		).resolves.not.toThrow();

		expect(repo.update).toHaveBeenCalledOnce();
	});

	it("autorul poate actualiza propria lecție", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);

		await expect(
			useCase.execute("lesson-1", { title: "New Title Here" }, "author-1", "teacher"),
		).resolves.not.toThrow();
	});

	it("aruncă ForbiddenError dacă non-autor încearcă să actualizeze", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);

		await expect(
			useCase.execute("lesson-1", { title: "Hacked Title" }, "intrus-99", "teacher"),
		).rejects.toBeInstanceOf(ForbiddenError);

		expect(repo.update).not.toHaveBeenCalled();
	});

	it("actualizează titlul și regenerează slug-ul", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);

		const result = await useCase.execute(
			"lesson-1",
			{ title: "Merge Sort Algorithm" },
			"author-1",
			"teacher",
		);

		expect(result.title).toBe("Merge Sort Algorithm");
		expect(result.slug).toBe("merge-sort-algorithm");
	});

	it("loghează modificarea titlului în repo.logEdit", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);
		repo.logEdit.mockResolvedValue(undefined);

		await useCase.execute("lesson-1", { title: "New Title Here" }, "author-1", "teacher");

		expect(repo.logEdit).toHaveBeenCalledOnce();
		const [, , changes] = repo.logEdit.mock.calls[0] as [string, string, Array<{ field: string }>];
		expect(changes.some((c) => c.field === "title")).toBe(true);
	});

	it("nu apelează logEdit dacă nu există modificări reale", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);

		await useCase.execute("lesson-1", { isActive: false }, "author-1", "teacher");

		expect(repo.logEdit).not.toHaveBeenCalled();
	});

	it("păstrează câmpurile nemodificate din lecția originală", async () => {
		const lesson = makeLessonWithAuthor("author-1");
		repo.get.mockResolvedValue(lesson);
		repo.update.mockResolvedValue(undefined);

		const result = await useCase.execute(
			"lesson-1",
			{ durationSeconds: 120 },
			"author-1",
			"teacher",
		);

		expect(result.moduleId).toBe("module-1");
		expect(result.title).toBe("Binary Search");
	});
});
