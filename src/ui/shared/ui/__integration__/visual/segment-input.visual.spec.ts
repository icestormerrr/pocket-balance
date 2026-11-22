import {expect, test} from "@playwright/test";

for (const theme of ["dark", "light"]) {
  test(`@visual segmented input sizes in ${theme} theme`, async ({page}) => {
    await page.addInitScript(value => localStorage.setItem("ui-theme", value), theme);
    await page.goto("/iframe.html?id=shared-segment-input--sizes&viewMode=story");
    for (const [size, height] of [
      ["sm", 36],
      ["md", 44],
      ["lg", 64],
    ] as const) {
      const list = page.getByRole("tablist", {name: size, exact: true});
      await expect(list).toBeVisible();
      expect((await list.boundingBox())!.height).toBe(height);
    }
    await expect(page.locator("#storybook-root")).toHaveScreenshot(`segment-input-sizes-${theme}.png`);
  });
}
