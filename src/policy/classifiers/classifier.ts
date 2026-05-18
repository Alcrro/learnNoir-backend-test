import type OpenAI from "openai";
import type { Category } from "../../types";
import { logger } from "../../core/logger.js";

export class Classifier {
	constructor(private client: OpenAI) {
		// Initialize any necessary properties or configurations here
	}

	async classify(prompt: string): Promise<Category> {
		try {
			const response = await this.client.responses.create({
				model: "gpt-4.1-mini",
				max_output_tokens: 20,
				text: {
					format: {
						type: "json_schema",
						name: "classification",
						schema: {
							type: "object",
							properties: {
								category: {
									type: "string",
									enum: ["math", "algorithm", "general"],
								},
							},
							required: ["category"],
						},
					},
				},
				input: `Classify this input:

${prompt}`,
			});
			const json = JSON.parse(response.output_text || "{}");

			if (!json.category) {
				throw new Error("Invalid classification");
			}

			return json.category;
		} catch (error) {
			logger.error({ error }, "Error classifying input");
			throw error;
		}
	}
}
