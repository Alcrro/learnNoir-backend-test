# LearnNoir — Backend

Express 5 + TypeScript REST API powering the LearnNoir educational platform. Serves interactive lessons, exercises, AI-generated content, subscriptions, and organizations.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Security](#security)
- [Features](#features)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20, ESM (`"type": "module"`) |
| Framework | Express 5 |
| Language | TypeScript 5 (strict mode) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT via `jose` + `httpOnly` cookie |
| Cache | Redis (ioredis) |
| AI | OpenAI `gpt-4.1-mini` |
| Payments | Stripe |
| Observability | Sentry, Pino logger |
| Validation | Zod |
| Code sandbox | vm2 (isolated Node.js VM) |
| Testing | Vitest |
| Build | esbuild |

---

## Architecture

The backend follows **Clean Architecture / DDD**. Every feature is self-contained and divided into four layers:

```
src/features/<name>/
  domain/           ← entities, repository interfaces, value types — zero external deps
  application/      ← use cases + DTOs — depends only on domain
  infrastructure/   ← Supabase repos, AI services, cache, mappers, factory (DI wiring)
  interfaces/       ← Express controllers + route definitions
  __tests__/        ← Vitest unit tests
```

Dependency flow:

```
interfaces → application → domain
infrastructure → domain  (implements interfaces)
```

There is no IoC container. Each feature has a `*.factory.ts` file that manually wires concrete implementations into use cases and returns a controller. Routes call the factory once at startup.

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                         # Express app, middleware, route mounting
│   ├── server.ts                      # HTTP server bootstrap
│   ├── instrument.ts                  # Sentry instrumentation
│   ├── database.types.ts              # Auto-generated Supabase types
│   ├── config/
│   │   └── env.ts                     # All process.env access (validated at startup)
│   ├── core/
│   │   ├── db/supabaseClient.ts       # Service-role Supabase client
│   │   ├── db/supabaseAuthClient.ts   # Auth Supabase client
│   │   ├── cache/redis.ts             # ioredis client
│   │   └── logger.ts                  # Pino logger
│   ├── utils/
│   │   ├── requireAuthMiddleware.ts   # JWT cookie → req.userId / req.userRole
│   │   ├── requireProMiddleware.ts    # Blocks non-pro users (paywall)
│   │   ├── roleRequiredMiddleware.ts  # RBAC: teacher / admin guard
│   │   ├── validateInputMiddleware.ts # Zod schema → req.body
│   │   ├── asyncHandlerMiddleware.ts  # Wraps async handlers, propagates errors
│   │   ├── cacheKey.ts                # Cache key builder
│   │   └── errors/                    # AppError, DatabaseError, errorMiddleware
│   ├── policy/
│   │   ├── promptPolicies.ts          # AI prompt policies (system prompts + validation)
│   │   └── classifiers/classifier.ts  # Content classification
│   └── features/                      # Feature modules (see below)
├── supabase/
│   └── migrations/                    # SQL migration files
├── .github/workflows/deploy.yml       # CI/CD pipeline
├── Dockerfile
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server with hot reload (port 3000)
npm run dev

# Type-check only
npm run typecheck

# Lint
npm run lint

# Run tests
npm test
npm run test:watch
```

---

## Environment Variables

Create a `.env` file in `backend/`:

| Variable | Description |
|---|---|
| `PORT` | HTTP port (default: 3000) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `SUPABASE_DATABASE_URL` | Direct PostgreSQL connection URL |
| `OPENAI_API_KEY` | OpenAI API key |
| `REDIS_URL` | Redis connection URL |
| `CACHE_TTL` | Default Redis TTL in seconds (default: 3600) |
| `ALGORITHM_DOC_CACHE_TTL` | Algorithm doc cache TTL in seconds (default: 86400) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CORS_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `SENTRY_DSN` | Sentry DSN (optional, no-op if absent) |

---

## API Routes

All routes are prefixed with `/api`.

| Prefix | Feature | Access |
|---|---|---|
| `GET /health` | Health check (ECS / load balancer) | Public |
| `/api/auth` | Login, register, logout, `/me` | Public / cookie |
| `/api/profiles` | User profile CRUD | Auth |
| `/api/subjects` | Top-level subjects | Public / Auth |
| `/api/categories` | Content categories | Public / Auth |
| `/api/modules` | Course modules | Public / Auth |
| `/api/lessons` | Lesson CRUD, publish, review | Public / Teacher+ |
| `/api/lessons/ai` | AI lesson block generation | Teacher+ |
| `/api/lessons-block` | Lesson block content | Auth / Teacher+ |
| `/api/lesson-activities` | Per-user activity tracking | Auth |
| `/api/lessons/:id/versions` | Lesson version history | Teacher+ |
| `/api/lessons/:id/theory-interactions` | AI theory interactions | Auth / Pro / Teacher+ |
| `/api/lessons/:id/exercises` | Coding exercises per lesson | Auth / Pro |
| `/api/exercises` | Exercise run & submit | Auth |
| `/api/progress` | User learning progress | Auth |
| `/api/lessons/:id/audio` | AI-generated audio narration | Auth |
| `/api/lessons/:id/video` | AI-generated video | Auth |
| `/api/subscriptions` | Individual Stripe subscriptions | Auth |
| `/api/organizations` | Org management + org subscriptions | Auth |

---

## Security

### HTTP Headers
[Helmet](https://helmetjs.github.io/) enforces a strict Content Security Policy:
- Scripts and styles: `'self'` + `cdn.jsdelivr.net` only
- `connectSrc`: `'self'` + `api.openai.com` only
- Images: `'self'` + inline `data:` URIs

### CORS
Only the origin in `CORS_ORIGIN` is allowed. `credentials: true` is required to forward the auth cookie.

### Authentication
Login sets an `httpOnly`, `SameSite=Strict` cookie named `accessToken` containing a signed JWT. `requireAuthMiddleware` decodes the JWT, looks up the user profile in Supabase, and attaches `req.userId` and `req.userRole` to the request. No `Authorization` header pattern is used anywhere.

### Role-based Access Control (RBAC)
`roleRequiredMiddleware(roles[])` enforces three roles:

| Role | Permissions |
|---|---|
| `student` | Default after registration. Can access public content and own progress. |
| `teacher` | Create, edit, publish lessons. Generate AI content. |
| `admin` | All teacher permissions plus platform administration. |

### Paywall
`requireProMiddleware` blocks access to pro-only endpoints for users without an active subscription. It checks both individual `subscriptions` and `organization_subscriptions` tables, so org members automatically inherit pro access.

### Rate Limiting
Auth endpoints (`/login`, `/register`) are limited to **10 requests per IP per 15 minutes** via `express-rate-limit`.

### Input Validation
Every mutating endpoint passes `req.body` through a Zod schema via `validateInput()` before the controller runs. Invalid input returns `400` with a structured error.

### Code Execution Sandbox
The exercises feature runs student-submitted JavaScript inside a `vm2` isolated VM with no access to the filesystem, network, or `require`.

---

## Features

| Feature | Description | README |
|---|---|---|
| **auth** | Login, register, logout, current user | [README](src/features/auth/README.md) |
| **profiles** | User profile management | [README](src/features/profiles/README.md) |
| **subjects** | Top-level curriculum subjects | [README](src/features/subjects/README.md) |
| **categories** | Content categories | [README](src/features/categories/README.md) |
| **modules** | Course modules grouping lessons | [README](src/features/modules/README.md) |
| **lessons** | Lesson CRUD, workflow, AI block generation | [README](src/features/lessons/README.md) |
| **lessons-block** | Lesson blocks (content / interactive / assessment) | [README](src/features/lessons-block/README.md) |
| **lesson-activities** | Per-user lesson activity tracking | [README](src/features/lesson-activities/README.md) |
| **lesson-versions** | Lesson version history | [README](src/features/lesson-versions/README.md) |
| **lesson-audio** | AI-generated audio narration | [README](src/features/lesson-audio/README.md) |
| **lesson-video** | AI-generated lesson video | [README](src/features/lesson-video/README.md) |
| **lesson-theory-interactions** | AI interactive theory components | [README](src/features/lesson-theory-interactions/README.md) |
| **exercises** | Coding exercises with sandboxed execution | [README](src/features/exercises/README.md) |
| **progress** | User learning progress tracking | [README](src/features/progress/README.md) |
| **subscriptions** | Individual Stripe subscriptions | [README](src/features/subscriptions/README.md) |
| **organizations** | Teams + org-level subscriptions | [README](src/features/organizations/README.md) |

---

## Testing

Tests use [Vitest](https://vitest.dev/) and live in `__tests__/` directories next to the code they cover.

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Coverage areas: lesson entity invariants, use case logic, block factory, middleware (auth, pro, cache key).

---

## Deployment

The app ships as a Docker container. CI/CD is handled by `.github/workflows/deploy.yml`.

```bash
# Build production bundle (esbuild)
npm run build

# Start production server
npm start
```
