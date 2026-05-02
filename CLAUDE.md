# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run dev server with hot reload
npm run dev

# Type-check (no emit)
npx tsc --noEmit

# Scaffold a new feature directory structure
./scripts/generate-feature-structure.sh <feature-name>
```

No test runner is configured yet (`npm test` exits with an error).

## Environment Variables

Required in `.env`:

```
PORT=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DATABASE_URL=
OPENAI_API_KEY=
REDIS_URL=
CACHE_TTL=           # seconds, default 3600
ALGORITHM_DOC_CACHE_TTL=  # seconds, default 86400
```

## Architecture

This is an **Express 5 + TypeScript** backend using **ES modules** (`"type": "module"` in package.json, run via `tsx`). It follows a strict **Clean Architecture / DDD** layout inside `src/features/`.

### Layer structure (per feature)

```
src/features/<name>/
  domain/           # entities, repository interfaces, types — no external deps
  application/      # use cases, DTOs — depends only on domain
  infrastructure/   # DB repos (Supabase), mappers, factories, cache, AI — implements interfaces
  interfaces/       # Express controllers and routes
```

The `infrastructure/factories/` file in each feature wires together the concrete implementations and use cases, then passes the result to the controller. Routes import the factory and call it to get a controller instance. This is the DI pattern used throughout — no IoC container.

### Key infrastructure

- **Database**: Supabase (`src/core/db/supabaseClient.ts`) — typed via generated `src/database.types.ts`. The service role key is used server-side.
- **Cache**: Redis via ioredis (`src/core/cache/redis.ts`), used in `OpenAIService` to cache AI responses. Cache keys built with `src/utils/cacheKey.ts`.
- **AI**: OpenAI (`gpt-4.1-mini`) wrapped in `OpenAIService`. All generation goes through a **policy** system (`src/policy/promptPolicies.ts`, `src/utils/selectPlicy.ts`) that enforces system prompts, input validation, and output validation before caching.

### Auth & middleware

- `requireAuthMiddleware` — decodes a JWT from `req.cookies.accessToken`, looks up the user profile, and attaches `req.userId` and `req.userRole` to the request.
- `roleRequiredMiddleware(roles[])` — must be applied after `requireAuthMiddleware`; returns 403 if the user's role isn't in the allowed list.
- `validateInput(zodSchema)` — validates `req.body` against a Zod schema; replaces the body with the parsed result.
- `asyncHandlerMiddleware` — wraps async route handlers so thrown errors propagate to `errorHandler`.
- `errorHandler` / `notFoundHandler` in `src/utils/errors/errorMiddleware.ts` handle all unhandled errors and 404s globally.

### Lesson block type system

Blocks are the atomic units of a lesson. The union type `LessonBlock` (in `src/features/lessons-block/domain/types/LessionEngine.type.ts`) discriminates on `type`:
- `"content"` — rich content nodes
- `"interactive"` — keyed by `engine: InteractiveEngine` (e.g. `"algorithm:bubble-sort"`, `"math:formula"`)
- `"assessment"` — keyed by `engine: AssessmentEngine` (e.g. `"quiz:mcq"`, `"quiz:input"`, `"quiz:code"`)

Each engine key maps to a specific `data` shape, enforced at the type level using mapped types.

### TypeScript config notes

- `moduleResolution: "bundler"` — `allowImportingTsExtensions` is on, so `.ts` extensions in imports are valid.
- Strict mode is fully enabled including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- The `test/` directory is excluded from compilation.
