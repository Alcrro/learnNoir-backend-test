import express, { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import { createSubscriptionController } from "../../infrastructure/factories/subscriptionFactory.ts";

const router = Router();
const controller = createSubscriptionController();

router.get("/me", requireAuthMiddleware, asyncHandlerMiddleware(controller.getMyPlan));

router.post(
	"/create-checkout-session",
	requireAuthMiddleware,
	asyncHandlerMiddleware(controller.createCheckoutSessionHandler),
);

// Stripe sends raw body — must NOT be parsed by express.json()
router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	asyncHandlerMiddleware(controller.handleWebhook),
);

export default router;
