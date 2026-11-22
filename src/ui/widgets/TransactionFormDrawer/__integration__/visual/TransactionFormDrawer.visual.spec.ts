import {expect, test} from "@playwright/test";

for (const state of ["create", "edit"]) {
  test(`@integration @visual transaction form ${state} matches its mobile baseline`, async ({page}) => {
    await page.goto(`/iframe.html?id=widgets-transactionformdrawer--${state}&viewMode=story`);
    await expect(
      page.getByRole("button", {name: state === "create" ? "Добавить расход" : "Сохранить изменения"})
    ).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page.locator("#storybook-root")).toHaveScreenshot(`transaction-form-${state}-mobile.png`);
    await page.getByRole("button", {name: "Закрыть", exact: true}).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
}

test("@integration drawer close button scrolls with the form", async ({page}) => {
  await page.setViewportSize({width: 390, height: 480});
  await page.goto("/iframe.html?id=widgets-transactionformdrawer--create&viewMode=story");
  const closeButton = page.getByRole("button", {name: "Закрыть", exact: true});
  await expect(closeButton).toBeVisible();
  const before = await closeButton.boundingBox();
  const scrollTop = await page.locator('[data-slot="drawer-content"] .no-scrollbar').first().evaluate(element => {
    element.scrollTop = 60;
    return element.scrollTop;
  });
  expect(scrollTop).toBeGreaterThan(0);
  const after = await closeButton.boundingBox();
  expect(after!.y).toBeLessThan(before!.y);
});
