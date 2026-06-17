import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetBlocksPreviewUseCase } from "../application/useCases/GetBlocksPreviewUseCase";
import { ContentBlockEntity } from "../domain/entities/ContentBlockEntity";
import { AssessmentBlockEntity } from "../domain/entities/AssessmentBlockEntity";
import { InteractiveBlockEntity } from "../domain/entities/InteractiveBlockEntity";

const makeBlockRepo = () => ({
	findById: vi.fn(),
	findByLessonId: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	reorder: vi.fn(),
	updateBlockData: vi.fn(),
});

const lessonId = "lesson-1";

const makeContent = (position: number) =>
	new ContentBlockEntity({ lessonId, position, data: { content: [] } });

const makeAssessment = (position: number) =>
	new AssessmentBlockEntity({
		lessonId,
		position,
		engine: "quiz:mcq",
		data: { question: "Q?", options: ["A", "B"], correctIndex: 0 },
	});

const makeInteractive = (position: number) =>
	new InteractiveBlockEntity({
		lessonId,
		position,
		engine: "algorithm:bubble-sort",
		data: { initialArray: [1, 2, 3] },
	});

describe("GetBlocksPreviewUseCase", () => {
	let repo: ReturnType<typeof makeBlockRepo>;
	let useCase: GetBlocksPreviewUseCase;

	beforeEach(() => {
		repo = makeBlockRepo();
		useCase = new GetBlocksPreviewUseCase(repo);
	});

	it("returnează toate block-urile non-assessment", async () => {
		repo.findByLessonId.mockResolvedValue([
			makeContent(0),
			makeInteractive(1),
			makeContent(2),
		]);

		const result = await useCase.execute(lessonId);

		expect(result).toHaveLength(3);
		expect(result.every((b) => b.type !== "assessment")).toBe(true);
	});

	it("limitează assessment block-urile la maxim 4 (FREE_QUIZ_LIMIT)", async () => {
		const blocks = [
			makeContent(0),
			...Array.from({ length: 6 }, (_, i) => makeAssessment(i + 1)),
		];
		repo.findByLessonId.mockResolvedValue(blocks);

		const result = await useCase.execute(lessonId);

		const assessments = result.filter((b) => b.type === "assessment");
		expect(assessments).toHaveLength(4);
	});

	it("returnează toate assessment-urile dacă sunt mai puțin de 4", async () => {
		repo.findByLessonId.mockResolvedValue([
			makeAssessment(0),
			makeAssessment(1),
			makeContent(2),
		]);

		const result = await useCase.execute(lessonId);

		const assessments = result.filter((b) => b.type === "assessment");
		expect(assessments).toHaveLength(2);
	});

	it("sortează rezultatele după position", async () => {
		repo.findByLessonId.mockResolvedValue([
			makeAssessment(3),
			makeContent(1),
			makeInteractive(0),
			makeContent(2),
		]);

		const result = await useCase.execute(lessonId);

		for (let i = 1; i < result.length; i++) {
			expect(result[i]!.position).toBeGreaterThanOrEqual(result[i - 1]!.position);
		}
	});

	it("returnează array gol dacă lecția nu are block-uri", async () => {
		repo.findByLessonId.mockResolvedValue([]);

		const result = await useCase.execute(lessonId);

		expect(result).toHaveLength(0);
	});

	it("nu include assessment-urile după limita de 4 (ia primele 4 în ordine)", async () => {
		const assessments = Array.from({ length: 6 }, (_, i) => makeAssessment(i));
		repo.findByLessonId.mockResolvedValue(assessments);

		const result = await useCase.execute(lessonId);

		expect(result).toHaveLength(4);
		const positions = result.map((b) => b.position);
		expect(positions).toEqual([0, 1, 2, 3]);
	});
});
