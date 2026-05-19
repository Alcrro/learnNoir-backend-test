# Feature: organizations

Teams and organization-level subscriptions. An organization has an owner who can invite members. All members of an organization with an active subscription inherit Pro access automatically — no individual subscription required.

---

## Responsibilities

- Create and manage organizations (owner-controlled)
- Invite and remove members (owner / admin)
- Fetch org details and member list
- Create org-level Stripe Checkout sessions
- Query org subscription status

---

## Architecture

```
organizations/
  domain/
    repositories/IOrganizationRepository.ts
    types/Organization.type.ts
  application/
    useCases/
      CreateOrganization.ts
      GetMyOrganizations.ts
      GetOrganization.ts
      AddMember.ts
      ListMembers.ts
      RemoveMember.ts
  infrastructure/
    db/OrganizationRepoImpl.ts
    factories/organizationFactory.ts
  interfaces/
    controller/Organization.controller.ts
    routes/organizations.routes.ts
```

---

## API Endpoints

All endpoints require authentication.

### Organization

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/organizations` | Create an organization |
| `GET` | `/api/organizations/mine` | List organizations the user belongs to |
| `GET` | `/api/organizations/:id` | Get organization details |

### Members

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/organizations/:id/members` | List all members |
| `POST` | `/api/organizations/:id/members` | Add a member by user ID or email |
| `DELETE` | `/api/organizations/:id/members/:userId` | Remove a member |

### Subscription

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/organizations/:id/subscription` | Get org's active subscription |
| `POST` | `/api/organizations/:id/subscription/create-checkout-session` | Create Stripe Checkout for org plan |

---

## Roles inside an organization

| Role | Permissions |
|---|---|
| `owner` | All permissions, can delete the org |
| `admin` | Can add/remove members |
| `member` | Read-only, inherits Pro plan |

---

## Pro Inheritance

When `requireProMiddleware` runs, it queries `organization_subscriptions` joined with `organization_members`. If the user is a member of any org with `status = 'active'`, they are treated as Pro — even if they have no individual subscription.
