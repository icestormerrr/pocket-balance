import {expect, test} from "@playwright/test";

const stories = [
  {id: "pages-accounts--default", name: "populated"},
  {id: "pages-accounts--empty", name: "empty"},
];

for (const story of stories) {
  test(`@integration @visual accounts page ${story.name} matches its mobile baseline`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

    await expect(page.getByRole("heading", {name: "Баланс"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Добавить счёт"})).toBeVisible();

    if (story.name === "populated") {
      await expect(page.getByText("Банковская карта")).toBeVisible();
    } else {
      await expect(page.getByText("Создайте свой первый счёт")).toBeVisible();
    }

    await page.waitForTimeout(400);
    await expect(page.locator("#storybook-root")).toHaveScreenshot(`accounts-page-${story.name}-mobile.png`);
  });
}
