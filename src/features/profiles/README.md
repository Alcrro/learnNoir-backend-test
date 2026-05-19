# Feature: profiles

Manages user profiles — reading, updating, and deleting profile data. Profile records are created automatically when a user registers (via a Supabase trigger or the auth flow) and are distinct from Supabase Auth identities.

---

## Responsibilities

- Fetch a user's profile by ID
- Update display name, avatar, and other profile fields
- Delete a profile (cascades to auth identity)

---

## Architecture

```
profiles/
  domain/
    entities/Profile.entity.ts
    repositories/ProfileRepository.interfaces.ts
    type/Profile.type.ts
  application/
    dto/ProfileDTO.dto.ts
    dto/ProfileDTO.type.ts
    dto/profile.schema.ts               # Zod update schema
    useCase/
      FindProfile.usecase.ts
      UpdateProfile.usecase.ts
      DeleteProfile.usecase.ts
  infrastructures/
    db/ProfilesRepoImpl.ts              # Supabase query impl
    mapper/ProfileInfr.mapper.ts        # DB row → Profile entity
  interfaces/
    controller/Profiles.controller.ts
    routes/Profiles.routes.ts
  profile.factory.ts
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profiles/:id` | Auth | Get a profile by user ID |
| `PUT` | `/api/profiles/:id` | Auth | Update own profile |
| `DELETE` | `/api/profiles/:id` | Auth | Delete own profile |

> All endpoints require a valid `accessToken` cookie.

---

## Domain: Profile Entity

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Matches Supabase Auth UID |
| `email` | `string` | |
| `displayName` | `string \| null` | |
| `avatarUrl` | `string \| null` | |
| `role` | `"student" \| "teacher" \| "admin"` | Set at registration; used by RBAC middleware |
| `createdAt` | `string` | ISO timestamp |
