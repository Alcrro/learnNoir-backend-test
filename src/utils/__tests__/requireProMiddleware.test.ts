import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextFunction, Request, Response } from "express";

const { mockGetPlan } = vi.hoisted(() => ({
	mockGetPlan: vi.fn(),
}));

vi.mock("../../core/db/supabaseClient", () => ({ supabase: {} }));

vi.mock("../../features/subscriptions/infrastructure/db/SubscriptionRepoImpl", () => ({
	SubscriptionRepoImpl: vi.fn(),
}));

vi.mock(
	"../../features/subscriptions/infrastructure/db/OrganizationSubscriptionRepoImpl",
	() => ({
		OrganizationSubscriptionRepoImpl: vi.fn(),
	}),
);

vi.mock(
	"../../features/subscriptions/application/useCases/GetActiveSubscription.usecase",
	() => ({
		GetActiveSubscriptionUseCase: vi.fn(function (
			this: { execute: typeof mockGetPlan },
		) {
			this.execute = mockGetPlan;
		}),
	}),
);

const { requireProMiddleware } = await import("../requireProMiddleware.js");

// --- Helpers ---
const makeReq = (userId?: string): Request =>
	({ userId }) as unknown as Request;

const makeRes = () => {
	const res = { status: vi.fn(), json: vi.fn() };
	res.status.mockReturnValue(res);
	res.json.mockReturnValue(res);
	return res as unknown as Response;
};

// --- Tests ---
describe("requireProMiddleware", () => {
	let next: NextFunction;

	beforeEach(() => {
		next = vi.fn();
		vi.clearAllMocks();
	});

	it("returnează 401 dacă userId lipsește din request", async () => {
		const res = makeRes();
		await requireProMiddleware(makeReq(undefined), res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returnează 402 dacă utilizatorul are plan free", async () => {
		mockGetPlan.mockResolvedValueOnce("free");
		const res = makeRes();
		await requireProMiddleware(makeReq("user-123"), res, next);
		expect(res.status).toHaveBeenCalledWith(402);
		expect(res.json).toHaveBeenCalledWith({ error: "Pro subscription required" });
		expect(next).not.toHaveBeenCalled();
	});

	it("apelează next() dacă utilizatorul are plan pro", async () => {
		mockGetPlan.mockResolvedValueOnce("pro");
		const res = makeRes();
		await requireProMiddleware(makeReq("user-456"), res, next);
		expect(next).toHaveBeenCalledOnce();
		expect(res.status).not.toHaveBeenCalled();
	});
});
