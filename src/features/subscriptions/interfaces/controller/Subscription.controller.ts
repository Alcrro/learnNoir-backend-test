import type { Request, Response } from "express";
import type { GetActiveSubscriptionUseCase } from "../../application/useCases/GetActiveSubscription.usecase.ts";
import type { UpsertSubscriptionUseCase } from "../../application/useCases/UpsertSubscription.usecase.ts";
import type { CreateCheckoutSessionUseCase } from "../../application/useCases/CreateCheckoutSession.usecase.ts";
import type { StripeService } from "../../infrastructure/stripe/StripeService.ts";
import { env } from "../../../../config/env.ts";

const FRONTEND_URL = env.CORS_ORIGIN;

export class SubscriptionController {
	constructor(
		private readonly getActiveSubscription: GetActiveSubscriptionUseCase,
		private readonly upsertSubscription: UpsertSubscriptionUseCase,
		private readonly createCheckoutSession: CreateCheckoutSessionUseCase,
		private readonly stripeService: StripeService,
	) {}

	getMyPlan = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const plan = await this.getActiveSubscription.execute(userId);
		res.json({ data: { plan } });
	};

	createCheckoutSessionHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
			res.status(503).json({ error: "Stripe not configured" });
			return;
		}

		const { cancelPath = "/" } = req.body as { cancelPath?: string };

		const url = await this.createCheckoutSession.execute({
			userId,
			successUrl: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${FRONTEND_URL}${cancelPath}`,
		});

		res.json({ data: { url } });
	};

	handleWebhook = async (req: Request, res: Response): Promise<void> => {
		const signature = req.headers["stripe-signature"];
		const isDev = env.NODE_ENV !== "production";
		const hasWebhookSecret = !!env.STRIPE_WEBHOOK_SECRET;

		let event;

		if (hasWebhookSecret) {
			if (!signature || typeof signature !== "string") {
				res.status(400).json({ error: "Missing stripe-signature header" });
				return;
			}
			try {
				event = this.stripeService.constructWebhookEvent(
					req.body as Buffer,
					signature,
				);
			} catch {
				res.status(400).json({ error: "Webhook signature verification failed" });
				return;
			}
		} else if (isDev) {
			// In dev without a webhook secret, parse body directly (stripe listen not yet configured)
			event = JSON.parse((req.body as Buffer).toString()) as { type: string; data: { object: Record<string, unknown> } };
		} else {
			res.status(503).json({ error: "Webhook secret not configured" });
			return;
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as { client_reference_id?: string };
			const userId = session.client_reference_id;

			if (userId) {
				await this.upsertSubscription.execute(userId, "pro");
			}
		}

		res.json({ received: true });
	};
}
