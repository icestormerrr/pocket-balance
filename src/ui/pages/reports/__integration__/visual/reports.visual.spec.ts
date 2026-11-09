import {expect, test} from "@playwright/test";

const stories = [
  {id: "pages-reports--cashflow", heading: "Денежный поток", snapshot: "reports-cashflow-mobile.png"},
  {id: "pages-reports--expense-insights", heading: "Разбор расходов", snapshot: "reports-expense-insights-mobile.png"},
  {id: "pages-reports--period-comparison", heading: "Сравнение периодов", snapshot: "reports-period-comparison-mobile.png"},
  {id: "pages-reports--account-flow", heading: "Активность по счетам", snapshot: "reports-account-flow-mobile.png"},
  {id: "pages-reports--empty", heading: "Нет данных для построения cashflow", snapshot: "reports-empty-mobile.png"},
];

for (const story of stories) {
  test(`@integration @visual reports ${story.id} matches its mobile baseline`, async ({page}) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

    await expect(page.getByRole("heading", {name: "Отчёты"})).toBeVisible();
    await expect(page.getByText(story.heading, {exact: true}).first()).toBeVisible();
    await page.waitForTimeout(400);

    await expect(page.locator("#storybook-root")).toHaveScreenshot(story.snapshot);
  });
}
