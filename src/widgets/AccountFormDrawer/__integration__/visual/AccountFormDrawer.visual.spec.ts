import {expect, test} from "@playwright/test";

for (const state of ["create", "edit"]) {
  test(`@integration @visual account form ${state} matches its mobile baseline`, async ({page}) => {
    await page.goto(`/iframe.html?id=widgets-accountformdrawer--${state}&viewMode=story`);
    await expect(page.getByRole("button", {name: "Отмена"})).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page.locator("#storybook-root")).toHaveScreenshot(`account-form-${state}-mobile.png`);
  });
}
