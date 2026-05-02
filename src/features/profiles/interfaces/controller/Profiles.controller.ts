import type { Request, Response } from "express";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
import type { FindProfileUseCase } from "../../application/useCase/FindProfile.usecase";
import type { UpdateProfileUseCase } from "../../application/useCase/UpdateProfile.usecase";
import type { DeleteProfileUseCase } from "../../application/useCase/DeleteProfile.usecase";

export class ProfileController {
	constructor(
		private readonly profileService: {
			findProfileUseCase: FindProfileUseCase;
			updateProfileUseCase: UpdateProfileUseCase;
			deleteProfileUseCase: DeleteProfileUseCase;
		},
	) {
		// Initialize any necessary properties or services here
	}

	getProfile = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const userId = req.params.userId;

		if (!userId || typeof userId !== "string") {
			return res.status(400).json({ error: "User ID is required" });
		}

		const profile = await this.profileService.findProfileUseCase.execute(userId);

		return res.status(200).json({ success: true, data: profile });
	});

	updateProfile = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const userId = req.params.userId;
		const profileData = req.body;

		if (!userId || typeof userId !== "string") {
			return res.status(400).json({ error: "User ID is required" });
		}

		const updatedProfile = await this.profileService.updateProfileUseCase.execute(
			userId,
			profileData,
		);
		return res.status(200).json({ success: true, data: updatedProfile });
	});

	deleteProfile = asyncHandlerMiddleware(async (req: Request, res: Response) => {
		const userId = req.params.userId;

		if (!userId || typeof userId !== "string") {
			return res.status(400).json({ error: "User ID is required" });
		}

		await this.profileService.deleteProfileUseCase.execute(userId);
		return res.status(204).send();
	});
}
