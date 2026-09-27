import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: ["**/*.integration.spec.ts", "**/*.e2e.spec.ts", "**/*.visual.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:6006",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    viewport: {width: 390, height: 844},
    deviceScaleFactor: 1,
    colorScheme: "dark",
    trace: "on-first-retry",
  },
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.001,
    },
  },
  webServer: {
    command: "npm run storybook -- --ci --port 6006",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
  },
});
