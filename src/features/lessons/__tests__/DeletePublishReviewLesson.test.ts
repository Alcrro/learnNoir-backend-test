import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteLessonUseCase } from "../application/useCases/deleteLesson.usecase";
import { PublishLessonUseCase } from "../application/useCases/publishLesson.usecase";
import { ReviewLessonUseCase } from "../application/useCases/reviewLesson.usecase";
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
	getBySlug: vi.fn(),
	logEdit: vi.fn(),
});

const makeLessonWithAuthor = (authorId: string) =>
	new LessonEntity({
		moduleId: "m1",
		title: "Binary Search",
		authors: [{ userId: authorId, role: "teacher" }],
	});

describe("DeleteLessonUseCase", () => {
	let repo: ReturnType<typeof makeLessonRepo>;

	beforeEach(() => {
		repo = makeLessonRepo();
	});

	it("admin poate șterge orice lecție fără verificare de autori", async () => {
		repo.delete.mockResolvedValue(undefined);

		await new DeleteLessonUseCase(repo).execute("lesson-1", "admin-id", "admin");

		expect(repo.get).not.toHaveBeenCalled();
		expect(repo.delete).toHaveBeenCalledWith("lesson-1");
	});

	it("autorul poate șterge propria lecție", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));
		repo.delete.mockResolvedValue(undefined);

		await expect(
			new DeleteLessonUseCase(repo).execute("lesson-1", "author-1", "teacher"),
		).resolves.not.toThrow();

		expect(repo.delete).toHaveBeenCalledWith("lesson-1");
	});

	it("aruncă ForbiddenError dacă non-autorul încearcă să șteargă", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));

		await expect(
			new DeleteLessonUseCase(repo).execute("lesson-1", "intrus-99", "teacher"),
		).rejects.toBeInstanceOf(ForbiddenError);

		expect(repo.delete).not.toHaveBeenCalled();
	});
});

describe("PublishLessonUseCase", () => {
	let repo: ReturnType<typeof makeLessonRepo>;

	beforeEach(() => {
		repo = makeLessonRepo();
	});

	it("admin poate publica orice lecție fără verificare de autori", async () => {
		repo.publish.mockResolvedValue(undefined);

		await new PublishLessonUseCase(repo).execute("lesson-1", "admin-id", "admin");

		expect(repo.get).not.toHaveBeenCalled();
		expect(repo.publish).toHaveBeenCalledWith("lesson-1");
	});

	it("autorul poate publica propria lecție", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));
		repo.publish.mockResolvedValue(undefined);

		await expect(
			new PublishLessonUseCase(repo).execute("lesson-1", "author-1", "teacher"),
		).resolves.not.toThrow();
	});

	it("aruncă ForbiddenError dacă non-autorul încearcă să publice", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));

		await expect(
			new PublishLessonUseCase(repo).execute("lesson-1", "intrus-99", "teacher"),
		).rejects.toBeInstanceOf(ForbiddenError);

		expect(repo.publish).not.toHaveBeenCalled();
	});
});

describe("ReviewLessonUseCase", () => {
	let repo: ReturnType<typeof makeLessonRepo>;

	beforeEach(() => {
		repo = makeLessonRepo();
	});

	it("admin poate trimite spre review orice lecție", async () => {
		repo.review.mockResolvedValue(undefined);

		await new ReviewLessonUseCase(repo).execute("lesson-1", "admin-id", "admin");

		expect(repo.get).not.toHaveBeenCalled();
		expect(repo.review).toHaveBeenCalledWith("lesson-1");
	});

	it("autorul poate trimite propria lecție spre review", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));
		repo.review.mockResolvedValue(undefined);

		await expect(
			new ReviewLessonUseCase(repo).execute("lesson-1", "author-1", "teacher"),
		).resolves.not.toThrow();
	});

	it("aruncă ForbiddenError dacă non-autorul încearcă review", async () => {
		repo.get.mockResolvedValue(makeLessonWithAuthor("author-1"));

		await expect(
			new ReviewLessonUseCase(repo).execute("lesson-1", "intrus-99", "teacher"),
		).rejects.toBeInstanceOf(ForbiddenError);

		expect(repo.review).not.toHaveBeenCalled();
	});
});
