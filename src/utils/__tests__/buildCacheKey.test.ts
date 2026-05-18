import { describe, it, expect } from "vitest";
import { buildCacheKey } from "../cacheKey";

describe("buildCacheKey", () => {
	it("returnează formatul type:hash cu SHA-256 de 64 de caractere", () => {
		const key = buildCacheKey("lesson", "what is recursion");
		expect(key).toMatch(/^lesson:[a-f0-9]{64}$/);
	});

	it("este determinist — același input produce mereu aceeași cheie", () => {
		const a = buildCacheKey("quiz", "binary search");
		const b = buildCacheKey("quiz", "binary search");
		expect(a).toBe(b);
	});

	it("normalizează spațiile și case-ul", () => {
		const upper = buildCacheKey("quiz", "Binary Search");
		const padded = buildCacheKey("quiz", "  binary search  ");
		expect(upper).toBe(padded);
	});

	it("input-uri diferite produc chei diferite", () => {
		const a = buildCacheKey("quiz", "binary search");
		const b = buildCacheKey("quiz", "linear search");
		expect(a).not.toBe(b);
	});

	it("același input cu tipuri diferite produc chei diferite", () => {
		const a = buildCacheKey("quiz", "sorting");
		const b = buildCacheKey("lesson", "sorting");
		expect(a).not.toBe(b);
	});
});
