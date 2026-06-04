import { describe, it, expect } from "vitest";
import { computeNextReviewDate, buildSRInfo } from "./spacedRepetitionService.ts";
import type { LessonProgress } from "../types/LessonProgress.type.ts";

const BASE_DATE = new Date("2026-01-01T12:00:00Z");

function daysAfter(date: Date, days: number): Date {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

describe("computeNextReviewDate", () => {
	it("reviewCount 0 → +1 zi", () => {
		const result = computeNextReviewDate(0, BASE_DATE);
		expect(result).toEqual(daysAfter(BASE_DATE, 1));
	});

	it("reviewCount 1 → +3 zile", () => {
		const result = computeNextReviewDate(1, BASE_DATE);
		expect(result).toEqual(daysAfter(BASE_DATE, 3));
	});

	it("reviewCount 2 → +7 zile", () => {
		const result = computeNextReviewDate(2, BASE_DATE);
		expect(result).toEqual(daysAfter(BASE_DATE, 7));
	});

	it("reviewCount 3 → +21 zile", () => {
		const result = computeNextReviewDate(3, BASE_DATE);
		expect(result).toEqual(daysAfter(BASE_DATE, 21));
	});

	it("reviewCount 4 → +60 zile", () => {
		const result = computeNextReviewDate(4, BASE_DATE);
		expect(result).toEqual(daysAfter(BASE_DATE, 60));
	});

	it("reviewCount > 4 se oprește la 60 zile", () => {
		const at5 = computeNextReviewDate(5, BASE_DATE);
		const at10 = computeNextReviewDate(10, BASE_DATE);
		expect(at5).toEqual(daysAfter(BASE_DATE, 60));
		expect(at10).toEqual(daysAfter(BASE_DATE, 60));
	});
});

const baseProgress: LessonProgress = {
	id: "1",
	userId: "u1",
	lessonId: "l1",
	status: "completed",
	weightedScore: 80,
	quizScore: 80,
	readScore: 80,
	outputScore: 0,
	lastActivityAt: null,
	createdAt: null,
	updatedAt: null,
	reviewCount: 0,
	lastReviewedAt: null,
	nextReviewAt: null,
};

describe("buildSRInfo", () => {
	it("nextReviewAt null → isDue false, daysUntilReview null", () => {
		const info = buildSRInfo(baseProgress);
		expect(info.isDue).toBe(false);
		expect(info.daysUntilReview).toBeNull();
	});

	it("nextReviewAt în viitor → isDue false, daysUntilReview > 0", () => {
		const now = new Date("2026-01-01T12:00:00Z");
		const progress = { ...baseProgress, nextReviewAt: daysAfter(now, 3).toISOString() };
		const info = buildSRInfo(progress, now);
		expect(info.isDue).toBe(false);
		expect(info.daysUntilReview).toBe(3);
	});

	it("nextReviewAt în trecut → isDue true, daysUntilReview <= 0", () => {
		const now = new Date("2026-01-10T12:00:00Z");
		const progress = { ...baseProgress, nextReviewAt: new Date("2026-01-08T12:00:00Z").toISOString() };
		const info = buildSRInfo(progress, now);
		expect(info.isDue).toBe(true);
		expect(info.daysUntilReview).toBeLessThanOrEqual(0);
	});

	it("nextReviewAt = now → isDue true", () => {
		const now = new Date("2026-01-05T12:00:00Z");
		const progress = { ...baseProgress, nextReviewAt: now.toISOString() };
		const info = buildSRInfo(progress, now);
		expect(info.isDue).toBe(true);
	});
});
