import type { ReviewInterval, SpacedRepetitionInfo } from "../../../../../../shared/src/lesson-review.ts";
import type { LessonProgress } from "../types/LessonProgress.type.ts";

const INTERVALS: ReviewInterval[] = [1, 3, 7, 21, 60];

export function computeNextReviewDate(reviewCount: number, completedAt: Date): Date {
	const interval = INTERVALS[Math.min(reviewCount, INTERVALS.length - 1)] as ReviewInterval;
	const next = new Date(completedAt);
	next.setDate(next.getDate() + interval);
	return next;
}

export function buildSRInfo(progress: LessonProgress, now: Date = new Date()): SpacedRepetitionInfo {
	const { nextReviewAt, lastReviewedAt, reviewCount } = progress;

	if (nextReviewAt === null) {
		return { reviewCount, lastReviewedAt, nextReviewAt: null, isDue: false, daysUntilReview: null };
	}

	const msPerDay = 1000 * 60 * 60 * 24;
	const daysUntilReview = Math.ceil((new Date(nextReviewAt).getTime() - now.getTime()) / msPerDay);

	return {
		reviewCount,
		lastReviewedAt,
		nextReviewAt,
		isDue: daysUntilReview <= 0,
		daysUntilReview,
	};
}
