import { createHash } from "crypto";

export const buildCacheKey = (type: string, input: string): string => {
	const hash = createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
	return `${type}:${hash}`;
};
