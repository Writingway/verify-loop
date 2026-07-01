import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  use: { baseURL: "http://localhost:5173", screenshot: "only-on-failure" },
  webServer: {
    command: "npx vite --port 5173 --strictPort",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
