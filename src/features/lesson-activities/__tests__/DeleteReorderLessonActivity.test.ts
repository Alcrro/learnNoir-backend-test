import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteLessonActivityUseCase } from "../application/useCases/deleteLessonActivityUseCase.usecase";
import { ReorderLessonActivityUseCase } from "../application/useCases/reorderLessonActivityUseCase.usecase";
import { LessonActivityEntity } from "../domain/entities/LessonActivityEntity";
import { AppError } from "../../../utils/errors/AppError";
import { BadRequestError } from "../../../utils/errors/DatabaseError";

const makeActivityRepo = () => ({
	findById: vi.fn(),
	findByLessonId: vi.fn(),
	create: vi.fn(),
	delete: vi.fn(),
	reorder: vi.fn(),
});

const makeActivity = () =>
	new LessonActivityEntity({
		lessonId: "lesson-1",
		type: "quiz",
		title: "Quiz 1",
		weight: 1,
		required: true,
		position: 0,
	});

describe("DeleteLessonActivityUseCase", () => {
	let repo: ReturnType<typeof makeActivityRepo>;

	beforeEach(() => {
		repo = makeActivityRepo();
	});

	it("șterge o activitate existentă", async () => {
		repo.findById.mockResolvedValue(makeActivity());
		repo.delete.mockResolvedValue(undefined);

		await new DeleteLessonActivityUseCase(repo).execute("activity-1");

		expect(repo.delete).toHaveBeenCalledWith("activity-1");
	});

	it("aruncă AppError cu status 404 dacă activitatea nu există", async () => {
		repo.findById.mockResolvedValue(null);

		await expect(new DeleteLessonActivityUseCase(repo).execute("missing-id")).rejects.toSatisfy(
			(e: AppError) => e instanceof AppError && e.statusCode === 404,
		);

		expect(repo.delete).not.toHaveBeenCalled();
	});
});

describe("ReorderLessonActivityUseCase", () => {
	let repo: ReturnType<typeof makeActivityRepo>;

	beforeEach(() => {
		repo = makeActivityRepo();
	});

	it("apelează repo.reorder cu argumentele corecte", async () => {
		repo.reorder.mockResolvedValue(undefined);

		await new ReorderLessonActivityUseCase(repo).execute("lesson-1", "activity-1", 3);

		expect(repo.reorder).toHaveBeenCalledWith("lesson-1", "activity-1", 3);
	});

	it("acceptă poziția 0", async () => {
		repo.reorder.mockResolvedValue(undefined);

		await expect(
			new ReorderLessonActivityUseCase(repo).execute("lesson-1", "activity-1", 0),
		).resolves.not.toThrow();
	});

	it("aruncă BadRequestError pentru poziție negativă", async () => {
		await expect(
			new ReorderLessonActivityUseCase(repo).execute("lesson-1", "activity-1", -1),
		).rejects.toBeInstanceOf(BadRequestError);

		expect(repo.reorder).not.toHaveBeenCalled();
	});

	it("aruncă BadRequestError pentru float", async () => {
		await expect(
			new ReorderLessonActivityUseCase(repo).execute("lesson-1", "activity-1", 1.5),
		).rejects.toBeInstanceOf(BadRequestError);
	});
});
