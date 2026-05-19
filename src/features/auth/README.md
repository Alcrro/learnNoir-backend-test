# Feature: auth

Handles user authentication — registration, login, logout, and current user retrieval. Uses Supabase Auth under the hood and issues a signed JWT stored in an `httpOnly` cookie.

---

## Responsibilities

- Register new users with email + password
- Authenticate existing users and issue a session cookie
- Decode and verify the session cookie (`/me`)
- Invalidate the session on logout

---

## Architecture

```
auth/
  application/
    dto/Auth.dto.ts                     # Request/response shapes
    dto/Auth.type.ts                    # Domain types
    dto/auth.schema.ts                  # Zod schemas (LoginSchema, RegisterSchema)
    repositories/auth.interfaces.ts     # IAuthRepository contract
    useCases/
      authWithCredentials.usecase.ts    # Login flow
      registerUser.usecase.ts           # Registration flow
      getCurrentUser.usecase.ts         # Token → user profile
  infrastructure/
    db/AuthRepositoryImpl.ts            # Supabase Auth calls
    mapper/authRepoImpl.mapper.ts       # DB row → domain type
  interfaces/
    controllers/Auth.controller.ts
    routes/auth.routes.ts
  Auth.factory.ts                       # DI wiring
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate with email + password. Sets `accessToken` cookie. |
| `POST` | `/api/auth/register` | Public | Create a new student account. |
| `GET` | `/api/auth/me` | Cookie | Return the authenticated user's profile. |
| `POST` | `/api/auth/logout` | Public | Clear the `accessToken` cookie. |

> Login and register are rate-limited to **10 requests per IP per 15 minutes**.

---

## Cookie

| Property | Value |
|---|---|
| Name | `accessToken` |
| `HttpOnly` | `true` — not readable from JavaScript |
| `SameSite` | `Strict` |
| `Secure` | `true` in production |

---

## Validation

| Endpoint | Schema |
|---|---|
| `POST /login` | `LoginSchema` — email, password (non-empty string) |
| `POST /register` | `RegisterSchema` — email, password, optional display name |

---

## Error Codes

| Scenario | HTTP |
|---|---|
| Invalid credentials | 401 |
| Validation failure | 400 |
| Rate limit exceeded | 429 |
