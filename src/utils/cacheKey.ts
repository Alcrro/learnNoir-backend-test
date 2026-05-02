export const buildCacheKey = (type: string, input: string): string => {
	return `${type}:${input.trim().toLowerCase()}`;
};
