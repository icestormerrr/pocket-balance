import {expect, test} from "@playwright/test";

for (const theme of ["dark", "light"]) {
  test(`@visual bottom bar in ${theme} theme`, async ({page}) => {
    await page.addInitScript(value => localStorage.setItem("ui-theme", value), theme);
    await page.goto("/iframe.html?id=layout-bottom-bar--default&viewMode=story");
    const navigation = page.getByRole("navigation", {name: "Основная навигация"});
    await expect(navigation).toBeVisible();
    await expect(page.getByRole("link", {name: "Счета", exact: true})).toHaveAttribute("aria-current", "page");
    await expect(navigation).toHaveScreenshot(`bottom-bar-${theme}.png`);
    await page.getByRole("link", {name: "Отчёты", exact: true}).click();
    await expect(page.getByRole("link", {name: "Отчёты", exact: true})).toHaveAttribute("aria-current", "page");
    await page.getByRole("button", {name: "Создать операцию", exact: true}).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Что создать?")).toBeVisible();
  });
}

test("@integration bottom bar fits a narrow mobile screen", async ({page}) => {
  await page.setViewportSize({width: 320, height: 640});
  await page.goto("/iframe.html?id=layout-bottom-bar--default&viewMode=story");
  const navigation = page.getByRole("navigation", {name: "Основная навигация"});
  await expect(navigation).toBeVisible();
  const box = await navigation.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  for (const link of await navigation.getByRole("link").all()) {
    await expect(link).toBeInViewport();
  }
});

test("@visual bottom bar glass over content in light theme", async ({page}) => {
  await page.addInitScript(() => localStorage.setItem("ui-theme", "light"));
  await page.goto("/iframe.html?id=layout-bottom-bar--over-content&viewMode=story");
  await expect(page.getByRole("region", {name: "Счёт под меню"})).toBeVisible({timeout: 60_000});
  await expect(page.getByRole("navigation", {name: "Основная навигация"})).toHaveScreenshot(
    "bottom-bar-over-content-light.png"
  );
});
