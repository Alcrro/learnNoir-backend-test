import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextFunction, Response } from "express";
import type { RequestWithUserId } from "../../features/auth/interfaces/controllers/Auth.controller.js";

// vi.hoisted — variabilele din factory sunt disponibile înainte de import-uri
const { mockJwtVerify, mockProfileExecute } = vi.hoisted(() => ({
	mockJwtVerify: vi.fn(),
	mockProfileExecute: vi.fn(),
}));

vi.mock("jose", () => ({
	createRemoteJWKSet: vi.fn(function () {
		return {};
	}),
	jwtVerify: mockJwtVerify,
}));

vi.mock("../../core/db/supabaseClient", () => ({ supabase: {} }));

// vi.fn() fără factory — Vitest creează un constructor mock valid
vi.mock("../../features/profiles/infrastructures/db/ProfilesRepoImpl", () => ({
	ProfileRepoImpl: vi.fn(),
}));

// Folosim function() pentru că source-ul face `new FindProfileUseCase(...)` — arrow functions nu sunt constructori
vi.mock("../../features/profiles/application/useCase/FindProfile.usecase", () => ({
	FindProfileUseCase: vi.fn(function (this: { execute: typeof mockProfileExecute }) {
		this.execute = mockProfileExecute;
	}),
}));

vi.mock("../../config/env", () => ({
	env: { SUPABASE_URL: "https://test.supabase.co" },
}));

// Import DUPĂ mock-uri (important în ESM cu await import)
const { requireAuthMiddleware } = await import("../requireAuthMiddleware.js");

// --- Helpers ---
const makeReq = (cookie?: string): RequestWithUserId =>
	({ cookies: { accessToken: cookie } }) as unknown as RequestWithUserId;

const makeRes = () => {
	const res = { status: vi.fn(), json: vi.fn() };
	res.status.mockReturnValue(res);
	res.json.mockReturnValue(res);
	return res as unknown as Response;
};

// --- Tests ---
describe("requireAuthMiddleware", () => {
	let next: NextFunction;

	beforeEach(() => {
		next = vi.fn();
		vi.clearAllMocks();
	});

	it("returnează 401 dacă nu există cookie accessToken", async () => {
		const res = makeRes();
		await requireAuthMiddleware(makeReq(undefined), res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returnează 401 dacă JWT-ul este invalid (jwtVerify aruncă eroare)", async () => {
		mockJwtVerify.mockRejectedValueOnce(new Error("invalid signature"));
		const res = makeRes();
		await requireAuthMiddleware(makeReq("bad.token"), res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returnează 401 dacă payload-ul nu conține sub", async () => {
		mockJwtVerify.mockResolvedValueOnce({ payload: {} });
		const res = makeRes();
		await requireAuthMiddleware(makeReq("token.no.sub"), res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returnează 401 dacă profilul nu există în DB", async () => {
		mockJwtVerify.mockResolvedValueOnce({ payload: { sub: "user-123" } });
		mockProfileExecute.mockResolvedValueOnce(null);
		const res = makeRes();
		await requireAuthMiddleware(makeReq("valid.token"), res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("apelează next() și setează userId + userRole pentru JWT valid cu profil existent", async () => {
		mockJwtVerify.mockResolvedValueOnce({ payload: { sub: "user-123" } });
		mockProfileExecute.mockResolvedValueOnce({ role: "student" });
		const req = makeReq("valid.token");
		const res = makeRes();
		await requireAuthMiddleware(req, res, next);
		expect(next).toHaveBeenCalledOnce();
		expect(req.userId).toBe("user-123");
		expect(req.userRole).toBe("student");
	});
});
