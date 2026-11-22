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

test("@integration theme segments update the theme and save the choice", async ({page}) => {
  await page.goto("/iframe.html?id=pages-more--default&viewMode=story");
  await page.getByRole("tab", {name: "Светлая", exact: true}).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await page.evaluate(() => localStorage.getItem("ui-theme"))).toBe("light");
  await page.getByRole("tab", {name: "Тёмная", exact: true}).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("tab", {name: "Тёмная", selected: true})).toBeVisible();
});

test("@visual more page keeps the glass surface visible in light mode", async ({page}) => {
  await page.goto("/iframe.html?id=pages-more--light-theme&viewMode=story");
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(page.getByRole("tab", {name: "Светлая", selected: true})).toBeVisible();
  await expect(page.locator("#storybook-root")).toHaveScreenshot("more-page-light-theme-mobile.png");
});
