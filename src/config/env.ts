import dotenv from "dotenv";

// Load .env file into process.env before anything else reads it
dotenv.config();

// Required variables — throw at startup if any are missing so the app fails fast and clearly
const required = [
	"SUPABASE_URL",
	"SUPABASE_ANON_KEY",
	"SUPABASE_SERVICE_ROLE_KEY",
	"SUPABASE_DATABASE_URL",
	"OPENAI_API_KEY",
	"REDIS_URL",
] as const;

for (const key of required) {
	if (!process.env[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

export const env = {
	// ── Runtime mode ──────────────────────────────────────────────────────────
	NODE_ENV: process.env.NODE_ENV ?? "development",
	isDev: process.env.NODE_ENV !== "production", // true in local dev
	isProd: process.env.NODE_ENV === "production", // true on the deployed server

	// ── Server ────────────────────────────────────────────────────────────────
	PORT: Number(process.env.PORT) || 3000,

	// ── CORS ──────────────────────────────────────────────────────────────────
	// Set CORS_ORIGIN=https://yourapp.vercel.app in production .env
	CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://0.0.0.0:5173",

	// ── Supabase ──────────────────────────────────────────────────────────────
	SUPABASE_URL: process.env.SUPABASE_URL as string,
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY as string,
	SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
	SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL as string,

	// ── OpenAI ────────────────────────────────────────────────────────────────
	OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,

	// Model for high-quality content generation (lesson bodies, quiz, improve)
	OPENAI_CONTENT_MODEL: process.env.OPENAI_CONTENT_MODEL ?? "gpt-4.1",
	// Model for fast, cheap tasks (titles, descriptions, reviews, narration scripts)
	OPENAI_FAST_MODEL: process.env.OPENAI_FAST_MODEL ?? "gpt-4.1-mini",
	// TTS model: "tts-1" (fast) | "tts-1-hd" (higher quality)
	OPENAI_TTS_MODEL: (process.env.OPENAI_TTS_MODEL ?? "tts-1-hd") as
		| "tts-1"
		| "tts-1-hd",
	// TTS voice: alloy | echo | fable | onyx | nova | shimmer
	OPENAI_TTS_VOICE: (process.env.OPENAI_TTS_VOICE ?? "onyx") as
		| "alloy"
		| "echo"
		| "fable"
		| "onyx"
		| "nova"
		| "shimmer",

	// ── Redis / Cache ─────────────────────────────────────────────────────────
	REDIS_URL: process.env.REDIS_URL as string,
	CACHE_TTL: Number(process.env.CACHE_TTL) || 3600, // seconds, default 1h
	ALGORITHM_DOC_CACHE_TTL: Number(process.env.ALGORITHM_DOC_CACHE_TTL) || 86400, // seconds, default 24h
} as const;
