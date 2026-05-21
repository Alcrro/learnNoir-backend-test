import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authControllerFactory } from "../../Auth.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { LoginSchema, RegisterSchema } from "../../application/dto/auth.schema";

const route = Router();

// Max 10 încercări per IP la fiecare 15 minute pe endpoint-urile de autentificare
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many attempts, please try again later." },
});

const authRepoController = authControllerFactory();
route.post("/login", authLimiter, validateInput(LoginSchema), authRepoController.login);
route.post("/register", authLimiter, validateInput(RegisterSchema), authRepoController.register);
route.get("/me", requireAuthMiddleware, authRepoController.getCurrentUser);
route.post("/refresh", authRepoController.refresh);
route.post("/logout", authRepoController.logout);

export default route;
