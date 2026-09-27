import {expect, test} from "@playwright/test";

test("@integration @visual transactions page matches its mobile baseline", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/iframe.html?id=pages-transactions--default&viewMode=story");

  await expect(page.getByRole("heading", {name: "Операции"})).toBeVisible();
  await expect(page.getByText("Продукты на неделю")).toBeVisible();
  await page.waitForTimeout(400);

  await expect(page.locator("#storybook-root")).toHaveScreenshot("transactions-page-mobile.png");
});
