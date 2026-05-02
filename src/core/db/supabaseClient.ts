import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.ts";
import type { Database } from "../../database.types.ts";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
	throw new Error("Missing Supabase credentials");
}

export const supabase = createClient<Database>(
	env.SUPABASE_URL,
	env.SUPABASE_SERVICE_ROLE_KEY,
);
