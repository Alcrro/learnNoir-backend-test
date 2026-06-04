import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateLessonUseCase } from "../application/useCases/createLesson.usecase";
import { LessonEntity } from "../domain/entities/Lesson";

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

const baseDto = { moduleId: "module-1", title: "Binary Search" };

describe("CreateLessonUseCase", () => {
	let repo: ReturnType<typeof makeLessonRepo>;
	let useCase: CreateLessonUseCase;

	beforeEach(() => {
		repo = makeLessonRepo();
		useCase = new CreateLessonUseCase(repo);
	});

	it("creează o lecție și returnează DTO-ul", async () => {
		const stored = new LessonEntity(baseDto);
		repo.create.mockResolvedValue(stored);

		const result = await useCase.execute(baseDto, "author-1");

		expect(repo.create).toHaveBeenCalledOnce();
		expect(result.title).toBe("Binary Search");
		expect(result.moduleId).toBe("module-1");
		expect(result.status).toBe("draft");
	});

	it("generează slug din titlu", async () => {
		const dto = { ...baseDto, title: "Quick Sort Algorithm" };
		const stored = new LessonEntity(dto);
		repo.create.mockResolvedValue(stored);

		const result = await useCase.execute(dto, "author-1");

		expect(result.slug).toBe("quick-sort-algorithm");
	});

	it("transmite authorId la repo.create", async () => {
		const stored = new LessonEntity(baseDto);
		repo.create.mockResolvedValue(stored);

		await useCase.execute(baseDto, "author-42");

		const [, passedAuthorId] = repo.create.mock.calls[0] as [unknown, string];
		expect(passedAuthorId).toBe("author-42");
	});

	it("aplică valorile default pentru câmpurile opționale", async () => {
		const stored = new LessonEntity(baseDto);
		repo.create.mockResolvedValue(stored);

		const result = await useCase.execute(baseDto, "author-1");

		expect(result.durationSeconds).toBe(0);
		expect(result.isActive).toBe(true);
		expect(result.gradeLevelId).toBeNull();
	});
});
