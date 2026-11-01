import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  reporter: "list",
  timeout: 30000,

  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run build && npm run start -- --port 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    env: {
      NEXT_DIST_DIR: ".next-playwright",
    },
    timeout: 120000,
  },
});
