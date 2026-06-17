import rateLimit from "express-rate-limit";

export const aiRateLimit = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many AI requests. Try again in 10 minutes." },
});

export const codeExecutionRateLimit = rateLimit({
	windowMs: 60 * 1000,
	max: 15,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many code execution requests. Try again in 1 minute." },
});
