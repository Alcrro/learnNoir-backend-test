import type { Request, Response } from "express";
import { createServices } from "../../application/composition/createServices";

export const generateResponse = async (req: Request, res: Response) => {
	try {
		const { prompt } = req.body;

		if (!prompt || prompt.length === 0) {
			return res.status(400).json({ error: "Prompt is required" });
		}

		const { openAIService } = createServices();
		const result = await openAIService.generate(prompt, prompt.trim());

		console.log(result);

		return res.json({ result });
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while generating the response." });
	}
};
