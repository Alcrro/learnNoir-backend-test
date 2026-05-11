import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// Graceful shutdown — stop accepting new connections and wait for in-flight requests to finish
// Triggered by Docker, Kubernetes, PM2, or Ctrl+C before the process exits
const shutdown = (signal: string) => {
	console.log(`${signal} received — shutting down gracefully`);
	server.close(() => {
		console.log("All connections closed");
		process.exit(0);
	});
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // Sent by Docker / Kubernetes / PM2 on stop
process.on("SIGINT", () => shutdown("SIGINT"));   // Sent by Ctrl+C in terminal

// Catch promise rejections not handled with .catch() — prevents silent failures
process.on("unhandledRejection", (reason) => {
	console.error("Unhandled rejection:", reason);
	process.exit(1);
});

// Catch synchronous throws that escape all try/catch blocks
process.on("uncaughtException", (error) => {
	console.error("Uncaught exception:", error);
	process.exit(1);
});
