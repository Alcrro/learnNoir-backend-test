import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { resolve } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@shared": resolve(__dirname, "../shared/src"),
		},
	},
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
