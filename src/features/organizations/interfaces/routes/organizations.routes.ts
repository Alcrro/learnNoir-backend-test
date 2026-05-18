import { Router } from "express";
import { requireAuthMiddleware } from "../../../../utils/requireAuthMiddleware.ts";
import { asyncHandlerMiddleware } from "../../../../utils/asyncHandlerMiddleware.ts";
import { createOrganizationController } from "../../infrastructure/factories/organizationFactory.ts";

const router = Router();
const controller = createOrganizationController();

// Organization CRUD
router.post("/", requireAuthMiddleware, asyncHandlerMiddleware(controller.create));
router.get("/mine", requireAuthMiddleware, asyncHandlerMiddleware(controller.getMine));
router.get("/:id", requireAuthMiddleware, asyncHandlerMiddleware(controller.getOne));

// Member management
router.get("/:id/members", requireAuthMiddleware, asyncHandlerMiddleware(controller.getMembers));
router.post("/:id/members", requireAuthMiddleware, asyncHandlerMiddleware(controller.addMemberHandler));
router.delete("/:id/members/:userId", requireAuthMiddleware, asyncHandlerMiddleware(controller.removeMemberHandler));

// Organization subscription
router.get("/:id/subscription", requireAuthMiddleware, asyncHandlerMiddleware(controller.getSubscription));
router.post("/:id/subscription/create-checkout-session", requireAuthMiddleware, asyncHandlerMiddleware(controller.createCheckoutSession));

export default router;
