import type { Policy } from "../types";

export const defaultPolicy: Policy = {
	systemPrompt: `
  - Avoid illegal, harmful, or unsafe content
  - No offensive or explicit content
  - Be concise and factual
  `,
};

export const mathAlgoPolicy: Policy = {
	systemPrompt: `
  - Only answer questions about mathematics or algorithms
  - If the question is خارج scope, say: "Out of scope"
  - Provide step-by-step reasoning
  - Use clear logic, no fluff
  `,
	validateInput: (input) => {
		return /math|algorithm|sort|graph|complexity|equation/i.test(input);
	},
};
