import type { Request, Response } from "express";
import { algorithmDocPrompt } from "../../../../prompts/alogirthmDocPrompt";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import { createServices } from "../../application/composition/createServices";

export const mathResponse = asyncHandlerMiddleware(
	async (req: Request, res: Response) => {
		const { prompt } = req.body;

		if (!prompt || typeof prompt !== "string") {
			return res.status(400).json({ error: "Invalid prompt" });
		}

		const { openAIService } = createServices();

		const openAiServices = await openAIService.generate(
			prompt,
			algorithmDocPrompt(prompt),
		);

		return res.status(200).json({ data: openAiServices });
	},
);
