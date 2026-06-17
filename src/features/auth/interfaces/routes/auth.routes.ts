import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authControllerFactory } from "../../Auth.factory";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware";
import { validateInput } from "../../../../utils/validateInputMiddleware";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware";
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
route.post("/login", authLimiter, validateInput(LoginSchema), asyncHandlerMiddleware(authRepoController.login));
route.post("/register", authLimiter, validateInput(RegisterSchema), asyncHandlerMiddleware(authRepoController.register));
route.get("/me", requireAuthMiddleware, asyncHandlerMiddleware(authRepoController.getCurrentUser));
route.post("/refresh", asyncHandlerMiddleware(authRepoController.refresh));
route.post("/logout", asyncHandlerMiddleware(authRepoController.logout));
route.post("/forgot-password", asyncHandlerMiddleware(authRepoController.forgotPassword));
route.post("/reset-password", asyncHandlerMiddleware(authRepoController.resetPassword));

export default route;
