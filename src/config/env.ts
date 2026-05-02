import dotenv from "dotenv";

dotenv.config();

export const env = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || "development",
	OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
	REDIS_URL: process.env.REDIS_URL || "",
	ALGORITHM_DOC_CACHE_TTL: parseInt(
		process.env.ALGORITHM_DOC_CACHE_TTL || "86400",
		10,
	), // Default to 24 hours
	CACHE_TTL: parseInt(process.env.CACHE_TTL || "3600", 10), // Default to 1 hour
	//
	SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL,
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
	SUPABASE_URL: process.env.SUPABASE_URL,
};
