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

for (const theme of ["dark", "light"]) {
  test(`@integration @visual account balance changes in ${theme} theme`, async ({page}) => {
    await page.clock.setFixedTime(new Date("2025-03-15T15:00:00Z"));
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(
      `/iframe.html?id=pages-accounts--balance-changes${theme === "light" ? "-light" : ""}&viewMode=story`
    );

    const accountCard = (name: string) =>
      page.locator('[data-slot="card"]').filter({has: page.getByText(name, {exact: true})});
    await expect(accountCard("Банковская карта").getByRole("status")).toHaveText(/\+27\s500 RUB/);
    await expect(accountCard("Наличные").getByRole("status")).toHaveText(/-3\s000 RUB/);
    await expect(accountCard("Накопления").getByRole("status")).toHaveText("Без изменений");
    await expect(page.getByText("С начала месяца")).toHaveCount(3);
    await expect(page.getByRole("button", {name: "Показать все"})).toHaveCount(0);
    await expect(page.locator("#storybook-root")).toHaveScreenshot(`accounts-balance-changes-${theme}-mobile.png`);

    await page.getByText("Банковская карта", {exact: true}).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", {name: "Сохранить изменения"})).toBeVisible();
  });
}
