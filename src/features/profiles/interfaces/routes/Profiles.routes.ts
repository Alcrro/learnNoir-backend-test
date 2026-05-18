import { Router } from "express";
import { profileControllerFactory } from "../../profile.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { UpdateProfileSchema } from "../../application/dto/profile.schema";

const route = Router();

const profileControllerFactoy = profileControllerFactory();

route.get("/:userId", requireAuthMiddleware, profileControllerFactoy.getProfile);
route.put(
	"/:userId",
	requireAuthMiddleware,
	validateInput(UpdateProfileSchema),
	profileControllerFactoy.updateProfile,
);
route.delete("/:userId", requireAuthMiddleware, profileControllerFactoy.deleteProfile);

export default route;
