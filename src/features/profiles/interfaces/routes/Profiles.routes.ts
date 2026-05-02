import { Router } from "express";
import { profileControllerFactory } from "../../profile.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";

const route = Router();

const profileControllerFactoy = profileControllerFactory();

route.get(
	"/:userId",
	requireAuthMiddleware,
	profileControllerFactoy.getProfile,
);
route.put(
	"/:userId",
	requireAuthMiddleware,
	profileControllerFactoy.updateProfile,
);
route.delete(
	"/:userId",
	requireAuthMiddleware,
	profileControllerFactoy.deleteProfile,
);

export default route;
