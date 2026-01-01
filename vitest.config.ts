import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**", // Exclude Playwright e2e tests
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
