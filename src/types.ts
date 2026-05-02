export type Policy = {
	systemPrompt: string;
	validateInput?: (input: string) => boolean;
	validateOutput?: (output: string) => boolean;
};
export type Category = "math" | "algorithm" | "general";
