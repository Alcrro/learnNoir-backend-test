import type { Request, Response } from "express";
import type { CreateOrganizationUseCase } from "../../application/useCases/CreateOrganization.usecase.ts";
import type { GetMyOrganizationsUseCase } from "../../application/useCases/GetMyOrganizations.usecase.ts";
import type { GetOrganizationUseCase } from "../../application/useCases/GetOrganization.usecase.ts";
import type { ListMembersUseCase } from "../../application/useCases/ListMembers.usecase.ts";
import type { AddMemberUseCase } from "../../application/useCases/AddMember.usecase.ts";
import type { RemoveMemberUseCase } from "../../application/useCases/RemoveMember.usecase.ts";
import type { GetOrgActiveSubscriptionUseCase } from "../../../../features/subscriptions/application/useCases/GetOrgActiveSubscription.usecase.ts";
import type { CreateOrgCheckoutSessionUseCase } from "../../../../features/subscriptions/application/useCases/CreateOrgCheckoutSession.usecase.ts";
import type { OrgMemberRole } from "../../domain/types/Organization.type.ts";
import { env } from "../../../../config/env.ts";

const FRONTEND_URL = env.CORS_ORIGIN;

export class OrganizationController {
	constructor(
		private readonly createOrg: CreateOrganizationUseCase,
		private readonly getMyOrgs: GetMyOrganizationsUseCase,
		private readonly getOrg: GetOrganizationUseCase,
		private readonly listMembers: ListMembersUseCase,
		private readonly addMember: AddMemberUseCase,
		private readonly removeMember: RemoveMemberUseCase,
		private readonly getOrgSubscription: GetOrgActiveSubscriptionUseCase,
		private readonly createOrgCheckout: CreateOrgCheckoutSessionUseCase,
	) {}

	create = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		const { name } = req.body as { name?: string };
		if (!name) { res.status(400).json({ error: "name is required" }); return; }

		const org = await this.createOrg.execute(name, userId);
		res.status(201).json({ data: org });
	};

	getMine = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		const orgs = await this.getMyOrgs.execute(userId);
		res.json({ data: orgs });
	};

	getOne = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		try {
			const org = await this.getOrg.execute(req.params["id"] as string, userId);
			res.json({ data: org });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Error";
			if (msg === "Organization not found") { res.status(404).json({ error: msg }); return; }
			if (msg === "Forbidden") { res.status(403).json({ error: msg }); return; }
			throw err;
		}
	};

	getMembers = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		try {
			const members = await this.listMembers.execute(req.params["id"] as string, userId);
			res.json({ data: members });
		} catch (err) {
			if (err instanceof Error && err.message === "Forbidden") {
				res.status(403).json({ error: "Forbidden" }); return;
			}
			throw err;
		}
	};

	addMemberHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		const { userId: targetUserId, role = "member" } = req.body as { userId?: string; role?: OrgMemberRole };
		if (!targetUserId) { res.status(400).json({ error: "userId is required" }); return; }

		try {
			const member = await this.addMember.execute(req.params["id"] as string, targetUserId, role, userId);
			res.status(201).json({ data: member });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Error";
			if (msg === "Forbidden" || msg.startsWith("Only") || msg.startsWith("Cannot") || msg.startsWith("Admins")) {
				res.status(403).json({ error: msg }); return;
			}
			if (msg === "User is already a member") { res.status(409).json({ error: msg }); return; }
			throw err;
		}
	};

	removeMemberHandler = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		try {
			await this.removeMember.execute(req.params["id"] as string, req.params["userId"] as string, userId);
			res.status(204).send();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Error";
			if (msg === "Forbidden" || msg.startsWith("Cannot") || msg.startsWith("Admins")) {
				res.status(403).json({ error: msg }); return;
			}
			if (msg === "Member not found") { res.status(404).json({ error: msg }); return; }
			throw err;
		}
	};

	getSubscription = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		try {
			// Verify user is a member by trying to get the org (throws Forbidden if not)
			await this.getOrg.execute(req.params["id"] as string, userId);
		} catch {
			res.status(403).json({ error: "Forbidden" }); return;
		}

		const plan = await this.getOrgSubscription.execute(req.params["id"] as string);
		res.json({ data: { plan } });
	};

	createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

		if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
			res.status(503).json({ error: "Stripe not configured" }); return;
		}

		const orgId = req.params["id"] as string;

		// Only owner can initiate payment
		try {
			const org = await this.getOrg.execute(orgId, userId);
			if (org.ownerId !== userId) {
				res.status(403).json({ error: "Only the organization owner can manage the subscription" }); return;
			}
		} catch {
			res.status(403).json({ error: "Forbidden" }); return;
		}

		const { cancelPath = "/" } = req.body as { cancelPath?: string };

		const url = await this.createOrgCheckout.execute({
			orgId,
			successUrl: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${FRONTEND_URL}${cancelPath}`,
		});

		res.json({ data: { url } });
	};
}
