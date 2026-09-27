import {expect, test, type Page} from "@playwright/test";

const openStory = async (page: Page, storyId: string) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
};

test("@integration @visual transactions page matches its mobile baseline", async ({page}) => {
  await openStory(page, "pages-transactions--default");

  await expect(page.getByRole("heading", {name: "Операции"})).toBeVisible();
  await expect(page.getByText("Продукты на неделю")).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("transactions-page-mobile.png");
});

test("@integration @visual transactions page shows an empty period", async ({page}) => {
  await openStory(page, "pages-transactions--empty");

  await expect(page.getByText("Хм, похоже нет операций за этот период...")).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("transactions-page-empty-mobile.png");
});

test("@integration @visual transactions page shows the date filter", async ({page}) => {
  await openStory(page, "pages-transactions--default");

  await page.getByText("Период").click();
  await expect(page.getByText("2025", {exact: true})).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("transactions-page-date-filter-mobile.png");
});
