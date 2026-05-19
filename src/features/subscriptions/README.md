# Feature: subscriptions

Manages individual (user-level) Stripe subscriptions. Handles checkout session creation, webhook processing, and subscription status queries. Organization subscriptions live in the **organizations** feature.

---

## Responsibilities

- Create a Stripe Checkout session for a user to subscribe
- Process Stripe webhook events to upsert subscription records
- Return the authenticated user's current plan

---

## Architecture

```
subscriptions/
  domain/
    repositories/
      ISubscriptionRepository.ts
      IOrganizationSubscriptionRepository.ts
    types/
      Subscription.type.ts
      OrganizationSubscription.type.ts
  application/
    useCases/
      CreateCheckoutSession.ts
      CreateOrgCheckoutSession.ts
      GetActiveSubscription.ts
      GetOrgActiveSubscription.ts
      UpsertSubscription.ts
      UpsertOrgSubscription.ts
  infrastructure/
    db/
      SubscriptionRepoImpl.ts
      OrganizationSubscriptionRepoImpl.ts
    stripe/
      IStripeService.ts
      StripeService.ts                # Stripe SDK wrapper
    factories/subscriptionFactory.ts
  interfaces/
    controller/Subscription.controller.ts
    routes/subscriptions.routes.ts
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/subscriptions/me` | Auth | Get current user's active plan |
| `POST` | `/api/subscriptions/create-checkout-session` | Auth | Create a Stripe Checkout session URL |
| `POST` | `/api/subscriptions/webhook` | Public (Stripe signature) | Process Stripe lifecycle events |

> The webhook route bypasses `express.json()` — it receives the raw request body so Stripe's signature can be verified.

---

## Stripe Webhook Flow

```
Stripe ──POST /webhook──► verify signature
                          ──► parse event type
                          ──► upsert subscriptions table
                          ──► return 200
```

Events handled:

| Event | Action |
|---|---|
| `checkout.session.completed` | Create or activate subscription |
| `customer.subscription.updated` | Update plan/status |
| `customer.subscription.deleted` | Mark subscription as cancelled |

---

## Plan Gating

`requireProMiddleware` (in `src/utils/`) reads the active subscription from the database at request time. A user is considered "pro" if they have an active row in `subscriptions` **or** if they belong to an organization with an active row in `organization_subscriptions`.
