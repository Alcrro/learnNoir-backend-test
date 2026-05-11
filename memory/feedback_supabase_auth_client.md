---
name: Supabase auth client must be separate from service-role client
description: Calling signInWithPassword on the service-role client poisons it with user auth session, breaking all subsequent RLS bypass
type: feedback
---

Never call Supabase auth methods (signInWithPassword, signUp, etc.) on the same client instance used for database writes with the service role key.

**Why:** When `supabase.auth.signInWithPassword()` is called, it overwrites the client's internal auth session with the user JWT. The service role privilege is lost, and all subsequent DB writes fail with "new row violates row-level security policy".

**How to apply:** Always maintain two separate Supabase client instances:
- `supabaseClient.ts` → service role key, used for all DB operations (bypasses RLS)
- `supabaseAuthClient.ts` → anon key, used exclusively for auth operations (signUp, signInWithPassword)

Fix applied in `src/features/auth/Auth.factory.ts` — `AuthRepositoryImpl` now receives `supabaseAuth` (anon key) while `ProfileRepoImpl` keeps the service-role `supabase`.
