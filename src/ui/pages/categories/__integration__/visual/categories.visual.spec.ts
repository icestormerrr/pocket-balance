import {expect, test} from "@playwright/test";

test("@integration @visual categories page matches populated expense categories", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-categories--default&viewMode=story");

  await expect(page.getByRole("heading", {name: "Категории"})).toBeVisible();
  await expect(page.getByText("Продукты")).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("categories-expense-mobile.png");
});

test("@integration @visual categories page matches income filter", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-categories--default&viewMode=story");

  await expect(page.getByText("Продукты")).toBeVisible();
  await page.getByText("Доход", {exact: true}).click();
  await expect(page.getByText("Зарплата")).toBeVisible();
  await expect(page.getByText("Продукты")).not.toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("categories-income-mobile.png");
});

test("@integration @visual categories page matches empty state", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-categories--empty&viewMode=story");

  await expect(page.getByRole("heading", {name: "Категории"})).toBeVisible();
  await expect(page.getByText("Добавить", {exact: true})).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("categories-empty-mobile.png");
});
