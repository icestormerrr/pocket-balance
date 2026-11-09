import {expect, test} from "@playwright/test";

for (const theme of ["dark", "light"] as const) {
  test(`@visual surface properties are distinguishable in ${theme} theme`, async ({page}) => {
    await page.emulateMedia({colorScheme: theme, reducedMotion: "reduce"});
    await page.addInitScript(selectedTheme => localStorage.setItem("ui-theme", selectedTheme), theme);
    await page.goto("/iframe.html?id=shared-surface--visual-properties&viewMode=story");

    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    await expect(page.getByTestId("surface-comparison")).toBeVisible();
    await expect(page.getByText("transparent", {exact: true})).toBeVisible();
    await expect(page.getByText("raised", {exact: true})).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator("#storybook-root")).toHaveScreenshot(`surface-properties-${theme}-mobile.png`);
  });
}
