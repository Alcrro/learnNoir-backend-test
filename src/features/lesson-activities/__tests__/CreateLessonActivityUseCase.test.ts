import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateLessonActivityUseCase } from "../application/useCases/createLessonActivityUseCase.usecase";
import { LessonActivityEntity } from "../domain/entities/LessonActivityEntity";
import { BadRequestError } from "../../../utils/errors/DatabaseError";

const makeActivityRepo = () => ({
	findById: vi.fn(),
	findByLessonId: vi.fn(),
	create: vi.fn(),
	delete: vi.fn(),
	reorder: vi.fn(),
});

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

const makeActivity = (overrides = {}) =>
	new LessonActivityEntity({
		lessonId: "lesson-1",
		type: "quiz",
		title: "Quiz 1",
		weight: 1,
		required: true,
		position: 0,
		...overrides,
	});

const baseDto = {
	lessonId: "lesson-1",
	type: "quiz" as const,
	title: "Quiz 1",
	weight: 1,
	required: true,
};

describe("CreateLessonActivityUseCase", () => {
	let activityRepo: ReturnType<typeof makeActivityRepo>;
	let lessonRepo: ReturnType<typeof makeLessonRepo>;
	let useCase: CreateLessonActivityUseCase;

	beforeEach(() => {
		activityRepo = makeActivityRepo();
		lessonRepo = makeLessonRepo();
		useCase = new CreateLessonActivityUseCase(activityRepo, lessonRepo);
		lessonRepo.get.mockResolvedValue({});
	});

	it("creează activitate la finalul listei când nu este specificată poziția", async () => {
		const existing = [makeActivity({ position: 0 }), makeActivity({ position: 1 })];
		activityRepo.findByLessonId.mockResolvedValue(existing);
		const created = makeActivity({ position: 2 });
		activityRepo.create.mockResolvedValue(created);

		const result = await useCase.execute(baseDto);

		expect(activityRepo.create).toHaveBeenCalledOnce();
		expect(activityRepo.reorder).not.toHaveBeenCalled();
		expect(result.position).toBe(2);
	});

	it("creează activitate la poziția specificată și reordonează", async () => {
		const existing = [makeActivity({ position: 0 }), makeActivity({ position: 1 })];
		activityRepo.findByLessonId.mockResolvedValue(existing);
		const created = makeActivity({ position: 2 });
		activityRepo.create.mockResolvedValue(created);
		const reloaded = makeActivity({ position: 0 });
		activityRepo.findById.mockResolvedValue(reloaded);
		activityRepo.reorder.mockResolvedValue(undefined);

		await useCase.execute({ ...baseDto, position: 0 });

		expect(activityRepo.reorder).toHaveBeenCalledOnce();
		expect(activityRepo.findById).toHaveBeenCalledOnce();
	});

	it("aruncă BadRequestError dacă poziția este negativă", async () => {
		activityRepo.findByLessonId.mockResolvedValue([]);

		await expect(useCase.execute({ ...baseDto, position: -1 })).rejects.toBeInstanceOf(
			BadRequestError,
		);
	});

	it("aruncă BadRequestError dacă poziția depășește numărul de activități existente", async () => {
		activityRepo.findByLessonId.mockResolvedValue([makeActivity()]);

		await expect(useCase.execute({ ...baseDto, position: 5 })).rejects.toBeInstanceOf(
			BadRequestError,
		);
	});

	it("aruncă eroare dacă lecția nu există", async () => {
		lessonRepo.get.mockRejectedValue(new Error("Lesson not found"));

		await expect(useCase.execute(baseDto)).rejects.toThrow("Lesson not found");
		expect(activityRepo.create).not.toHaveBeenCalled();
	});
});
