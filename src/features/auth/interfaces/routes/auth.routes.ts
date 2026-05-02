import { Router } from "express";
import { authControllerFactory } from "../../Auth.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";

const route = Router();

const authRepoController = authControllerFactory();
route.post("/login", authRepoController.login);
route.post("/register", authRepoController.register);
route.get("/me", requireAuthMiddleware, authRepoController.getCurrentUser);
route.post("/logout", authRepoController.logout);

export default route;
