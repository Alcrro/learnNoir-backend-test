import "./instrument.js";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./core/logger.js";

const server = app.listen(env.PORT, () => {
	logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});

const shutdown = (signal: string) => {
	logger.info(`${signal} received — shutting down gracefully`);
	server.close(() => {
		logger.info("All connections closed");
		process.exit(0);
	});
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
	logger.error({ reason }, "Unhandled rejection");
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	logger.error({ error }, "Uncaught exception");
	process.exit(1);
});
