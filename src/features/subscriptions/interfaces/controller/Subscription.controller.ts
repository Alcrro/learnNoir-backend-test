import type { Request, Response } from "express";
import type { GetActiveSubscriptionUseCase } from "../../application/useCases/GetActiveSubscription.usecase.ts";
import type { UpsertSubscriptionUseCase } from "../../application/useCases/UpsertSubscription.usecase.ts";
import type { UpsertOrgSubscriptionUseCase } from "../../application/useCases/UpsertOrgSubscription.usecase.ts";
import type { CreateCheckoutSessionUseCase } from "../../application/useCases/CreateCheckoutSession.usecase.ts";
import type { CreateCreatorCheckoutSessionUseCase } from "../../application/useCases/CreateCreatorCheckoutSession.usecase.ts";
import type { UpgradeSubscriptionUseCase } from "../../application/useCases/UpgradeSubscription.usecase.ts";
import type { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository.ts";
import type { IStripeService } from "../../infrastructure/stripe/IStripeService.ts";
import type { SubscriptionStatus } from "../../domain/types/Subscription.type.ts";
import { env } from "../../../../config/env.ts";
import { logger } from "../../../../core/logger.ts";

const FRONTEND_URL = env.CORS_ORIGIN;

export class SubscriptionController {
	constructor(
		private readonly getActiveSubscription: GetActiveSubscriptionUseCase,
		private readonly upsertSubscription: UpsertSubscriptionUseCase,
		private readonly upsertOrgSubscription: UpsertOrgSubscriptionUseCase,
		private readonly upgradeSubscription: UpgradeSubscriptionUseCase,
		private readonly createCheckoutSession: CreateCheckoutSessionUseCase,
		private readonly createCreatorCheckoutSession: CreateCreatorCheckoutSessionUseCase,
		private readonly repo: ISubscriptionRepository,
		private readonly stripeService: IStripeService,
	) {}

	getMyPlan = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		const { pro, creator } = await this.getActiveSubscription.execute(userId);
		res.json({ data: { pro, creator } });
	};

	upgradeToCreatorHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		if (!env.STRIPE_SECRET_KEY || !env.STRIPE_CREATOR_PRICE_ID) {
			res.status(503).json({ error: "Stripe not configured" }); return;
		}

		const { cancelPath = "/" } = req.body as { cancelPath?: string };

		const result = await this.upgradeSubscription.execute(userId, {
			successUrl: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=creator`,
			cancelUrl: `${FRONTEND_URL}${cancelPath}`,
		});

		res.json({ data: result });
	};

	createCheckoutSessionHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
			res.status(503).json({ error: "Stripe not configured" }); return;
		}

		const { cancelPath = "/" } = req.body as { cancelPath?: string };
		const sub = await this.repo.findByUserId(userId);

		const url = await this.createCheckoutSession.execute({
			userId,
			...(sub?.stripeCustomerId ? { stripeCustomerId: sub.stripeCustomerId } : {}),
			successUrl: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${FRONTEND_URL}${cancelPath}`,
		});

		res.json({ data: { url } });
	};

	createCreatorCheckoutSessionHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		if (!env.STRIPE_SECRET_KEY || !env.STRIPE_CREATOR_PRICE_ID) {
			res.status(503).json({ error: "Stripe not configured" }); return;
		}

		const { cancelPath = "/" } = req.body as { cancelPath?: string };
		const sub = await this.repo.findByUserId(userId);

		const url = await this.createCreatorCheckoutSession.execute({
			userId,
			...(sub?.stripeCustomerId ? { stripeCustomerId: sub.stripeCustomerId } : {}),
			successUrl: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=creator`,
			cancelUrl: `${FRONTEND_URL}${cancelPath}`,
		});

		res.json({ data: { url } });
	};

	createPortalSessionHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		if (!env.STRIPE_SECRET_KEY) {
			res.status(503).json({ error: "Stripe not configured" }); return;
		}

		const sub = await this.repo.findByUserId(userId);
		if (!sub?.stripeCustomerId) {
			res.status(404).json({ error: "No active subscription found" }); return;
		}

		const url = await this.stripeService.createBillingPortalSession(
			sub.stripeCustomerId,
			`${FRONTEND_URL}/pricing`,
		);

		res.json({ data: { url } });
	};

	handleWebhook = async (req: Request, res: Response): Promise<void> => {
		const signature = req.headers["stripe-signature"];
		const isDev = env.NODE_ENV !== "production";

		let event;

		if (env.STRIPE_WEBHOOK_SECRET) {
			if (!signature || typeof signature !== "string") {
				res.status(400).json({ error: "Missing stripe-signature header" }); return;
			}
			try {
				event = this.stripeService.constructWebhookEvent(req.body as Buffer, signature);
			} catch {
				res.status(400).json({ error: "Webhook signature verification failed" }); return;
			}
		} else if (isDev) {
			event = JSON.parse((req.body as Buffer).toString()) as { type: string; data: { object: Record<string, unknown> } };
		} else {
			res.status(503).json({ error: "Webhook secret not configured" }); return;
		}

		try {
			await this.handleEvent(event as { type: string; data: { object: Record<string, unknown> } });
		} catch (err) {
			logger.error({ err, type: event.type }, "[webhook] handler error");
		}

		res.json({ received: true });
	};

	private async handleEvent(event: { type: string; data: { object: Record<string, unknown> } }): Promise<void> {
		if (event.type === "checkout.session.completed") {
			const session = event.data.object as {
				client_reference_id?: string;
				customer?: string;
				subscription?: string;
				metadata?: Record<string, string>;
			};

			const orgId = session.metadata?.["orgId"];
			const userId = session.client_reference_id;
			const plan = session.metadata?.["plan"];
			const stripeCustomerId = session.customer;
			const stripeSubscriptionId = session.subscription;

			if (orgId) {
				await this.upsertOrgSubscription.execute(orgId, "pro");
				return;
			}

			if (!userId) return;

			await this.upsertSubscription.execute(userId, plan === "creator" ? "creator" : "pro");

			if (stripeCustomerId && stripeSubscriptionId) {
				await this.repo.saveStripeIds(userId, stripeCustomerId, stripeSubscriptionId);
			}
			return;
		}

		if (event.type === "customer.subscription.updated") {
			const sub = event.data.object as {
				id: string;
				status: string;
				items: { data: Array<{ price: { id: string } }> };
			};

			const priceId = sub.items.data[0]?.price.id;
			const plan = priceId ? this.stripeService.planFromPriceId(priceId) : null;
			const status = this.toSubscriptionStatus(sub.status);

			await this.repo.updateByStripeSubscriptionId(sub.id, {
				...(plan ? { plan } : {}),
				status,
			});
			return;
		}

		if (event.type === "customer.subscription.deleted") {
			const sub = event.data.object as { id: string };
			await this.repo.updateByStripeSubscriptionId(sub.id, { plan: "free", status: "canceled" });
			return;
		}

		if (event.type === "invoice.payment_failed") {
			const invoice = event.data.object as { subscription?: string };
			if (invoice.subscription) {
				await this.repo.updateByStripeSubscriptionId(invoice.subscription, { status: "past_due" });
			}
			return;
		}
	}

	private toSubscriptionStatus(stripeStatus: string): SubscriptionStatus {
		switch (stripeStatus) {
			case "active": return "active";
			case "trialing": return "trialing";
			case "past_due": return "past_due";
			default: return "canceled";
		}
	}
}
