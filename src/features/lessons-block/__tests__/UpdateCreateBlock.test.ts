import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateContentBlockUseCase } from "../application/useCases/updateContentBlockUseCase";
import { CreateLessonBlockUseCase } from "../application/useCases/createLessonBlockUseCase.usecase";
import { ContentBlockEntity } from "../domain/entities/ContentBlockEntity";
import { InteractiveBlockEntity } from "../domain/entities/InteractiveBlockEntity";
import { AssessmentBlockEntity } from "../domain/entities/AssessmentBlockEntity";
import { LessonBlockFactory } from "../domain/factories/lessonBlock.factory";
import { NotFoundError, BadRequestError } from "../../../utils/errors/DatabaseError";
import { AppError } from "../../../utils/errors/AppError";

const makeBlockRepo = () => ({
	findById: vi.fn(),
	findByLessonId: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
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

const lessonId = "lesson-1";

const makeContent = (position = 0) =>
	new ContentBlockEntity({ lessonId, position, data: { content: [] } });

const makeInteractive = (position = 0) =>
	new InteractiveBlockEntity({
		lessonId,
		position,
		engine: "algorithm:bubble-sort",
		data: { initialArray: [1, 2] },
	});

// --- UpdateContentBlockUseCase ---

describe("UpdateContentBlockUseCase", () => {
	let repo: ReturnType<typeof makeBlockRepo>;
	let useCase: UpdateContentBlockUseCase;

	beforeEach(() => {
		repo = makeBlockRepo();
		useCase = new UpdateContentBlockUseCase(repo);
	});

	it("actualizează conținutul unui content block", async () => {
		const block = makeContent();
		repo.findById.mockResolvedValue(block);
		repo.update.mockResolvedValue(undefined);

		const newContent = [{ type: "paragraph", text: "Hello" }] as never;
		await useCase.execute("block-1", newContent);

		expect(repo.update).toHaveBeenCalledOnce();
		expect(repo.update).toHaveBeenCalledWith("block-1", block);
	});

	it("aruncă NotFoundError dacă block-ul nu există", async () => {
		repo.findById.mockResolvedValue(null);

		await expect(useCase.execute("missing-id", [])).rejects.toBeInstanceOf(NotFoundError);
		expect(repo.update).not.toHaveBeenCalled();
	});

	it("aruncă AppError cu 400 dacă block-ul nu este de tip content", async () => {
		repo.findById.mockResolvedValue(makeInteractive());

		await expect(useCase.execute("block-1", [])).rejects.toSatisfy(
			(e: AppError) => e instanceof AppError && e.statusCode === 400,
		);

		expect(repo.update).not.toHaveBeenCalled();
	});

	it("aruncă AppError și pentru AssessmentBlock", async () => {
		const assessment = new AssessmentBlockEntity({
			lessonId,
			position: 0,
			engine: "quiz:mcq",
			data: {},
		});
		repo.findById.mockResolvedValue(assessment);

		await expect(useCase.execute("block-1", [])).rejects.toSatisfy(
			(e: AppError) => e instanceof AppError && e.statusCode === 400,
		);
	});
});

// --- CreateLessonBlockUseCase ---

describe("CreateLessonBlockUseCase", () => {
	let blockRepo: ReturnType<typeof makeBlockRepo>;
	let lessonRepo: ReturnType<typeof makeLessonRepo>;
	let useCase: CreateLessonBlockUseCase;

	beforeEach(() => {
		blockRepo = makeBlockRepo();
		lessonRepo = makeLessonRepo();
		useCase = new CreateLessonBlockUseCase(blockRepo, lessonRepo, new LessonBlockFactory());
		lessonRepo.get.mockResolvedValue({});
	});

	it("creează un block la finalul listei când nu este specificată poziția", async () => {
		blockRepo.findByLessonId.mockResolvedValue([makeContent(0), makeContent(1)]);
		const stored = makeContent(2);
		blockRepo.create.mockResolvedValue(stored);

		const result = await useCase.execute({
			type: "content",
			lessonId,
			data: { content: [] },
		});

		expect(blockRepo.create).toHaveBeenCalledOnce();
		expect(blockRepo.reorder).not.toHaveBeenCalled();
		expect(result.type).toBe("content");
	});

	it("reordonează dacă poziția specificată diferă de end", async () => {
		blockRepo.findByLessonId.mockResolvedValue([makeContent(0), makeContent(1)]);
		const stored = makeContent(2);
		blockRepo.create.mockResolvedValue(stored);
		blockRepo.reorder.mockResolvedValue(undefined);
		const reloaded = makeContent(0);
		blockRepo.findById.mockResolvedValue(reloaded);

		await useCase.execute({
			type: "content",
			lessonId,
			position: 0,
			data: { content: [] },
		});

		expect(blockRepo.reorder).toHaveBeenCalledOnce();
	});

	it("aruncă BadRequestError dacă poziția este negativă", async () => {
		blockRepo.findByLessonId.mockResolvedValue([]);

		await expect(
			useCase.execute({ type: "content", lessonId, position: -1, data: { content: [] } }),
		).rejects.toBeInstanceOf(BadRequestError);
	});

	it("aruncă BadRequestError dacă poziția depășește numărul de block-uri", async () => {
		blockRepo.findByLessonId.mockResolvedValue([makeContent(0)]);

		await expect(
			useCase.execute({ type: "content", lessonId, position: 5, data: { content: [] } }),
		).rejects.toBeInstanceOf(BadRequestError);
	});

	it("aruncă eroare dacă lecția nu există", async () => {
		lessonRepo.get.mockRejectedValue(new Error("Lesson not found"));

		await expect(
			useCase.execute({ type: "content", lessonId, data: { content: [] } }),
		).rejects.toThrow("Lesson not found");

		expect(blockRepo.create).not.toHaveBeenCalled();
	});
});
