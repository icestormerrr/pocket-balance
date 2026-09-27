import {expect, test} from "@playwright/test";

test("@integration @visual more page matches its dark mobile baseline", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-more--default&viewMode=story");

  await expect(page.getByRole("heading", {name: "Ещё"})).toBeVisible();
  await expect(page.getByRole("button", {name: /экспортировать/i})).toBeVisible();

  await expect(page.locator("#storybook-root")).toHaveScreenshot("more-page-mobile.png");
});

test("@integration @visual more page shows the system theme option in dark mode", async ({page}) => {
  await page.emulateMedia({colorScheme: "dark", reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-more--system-theme&viewMode=story");

  await expect(page.getByRole("tab", {name: "Системная", selected: true})).toBeVisible();

  await expect(page.locator("#storybook-root")).toHaveScreenshot("more-page-system-theme-mobile.png");
});
