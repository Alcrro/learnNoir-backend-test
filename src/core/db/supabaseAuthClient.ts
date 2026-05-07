import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.ts";
import type { Database } from "../../database.types.ts";

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
	throw new Error("Missing Supabase credentials");
}

// Separate client for auth-only operations (sign up / sign in).
// Must NOT be the same instance as the service-role client — calling
// signInWithPassword() on a shared client overwrites its auth session,
// which strips the service role and causes RLS to block all subsequent writes.
export const supabaseAuth = createClient<Database>(
	env.SUPABASE_URL,
	env.SUPABASE_ANON_KEY,
);
