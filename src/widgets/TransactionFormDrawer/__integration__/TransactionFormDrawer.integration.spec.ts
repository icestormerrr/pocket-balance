import {expect, test, type Page} from "@playwright/test";

const behaviorStoryUrl = "/iframe.html?id=widgets-transactionformdrawer--behavior&viewMode=story";
const behaviorEditStoryUrl = "/iframe.html?id=widgets-transactionformdrawer--behavior-edit&viewMode=story";

type RecentCategories = {expense: string[]; income: string[]};
type CreationDefaults = {day: string; accountId: string; date: string};

const readStorage = async <T>(page: Page, key: string): Promise<T | null> => {
  const serialized = await page.evaluate(storageKey => localStorage.getItem(storageKey), key);
  if (!serialized) return null;

  const parsed: unknown = JSON.parse(serialized);
  return parsed as T;
};

const quickCategoryNames = (page: Page) =>
  page
    .locator("section[aria-labelledby='transaction-category'] button")
    .evaluateAll(buttons => buttons.slice(0, 5).map(button => button.textContent ?? ""));

async function chooseAccount(page: Page) {
  await page.getByRole("button", {name: /Счёт.*Выберите счёт/}).click();
  await page.getByRole("button", {name: "Основной счёт", exact: true}).click();
}

async function chooseCategoryFromAll(page: Page, categoryName: string) {
  await page.getByRole("button", {name: "Все категории", exact: true}).click();
  await page.getByRole("button", {name: categoryName, exact: true}).click();
}

test("@integration list pickers apply a choice immediately and do not render a confirmation button", async ({page}) => {
  await page.goto(behaviorStoryUrl);

  await page.getByRole("button", {name: "Все категории", exact: true}).click();
  await expect(page.getByRole("heading", {name: "Все категории"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Готово", exact: true})).toHaveCount(0);
  await page.getByRole("button", {name: "Развлечения", exact: true}).click();
  await expect(page.getByRole("heading", {name: "Все категории"})).toHaveCount(0);

  await page.getByRole("button", {name: /Счёт.*Выберите счёт/}).click();
  await expect(page.getByRole("heading", {name: "Выберите счёт"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Готово", exact: true})).toHaveCount(0);
  await page.getByRole("button", {name: "Основной счёт", exact: true}).click();
  await expect(page.getByRole("heading", {name: "Выберите счёт"})).toHaveCount(0);
});

async function createExpense(page: Page, categoryName: string, amount: number) {
  await page.getByPlaceholder("0").fill(String(amount));
  await chooseCategoryFromAll(page, categoryName);
  await page.getByRole("button", {name: "Добавить расход", exact: true}).click();
  await expect(page.getByRole("button", {name: "Открыть форму", exact: true})).toBeVisible();
  await page.getByRole("button", {name: "Открыть форму", exact: true}).click();
}

test("@integration transaction creation validates only on submit and starts with today's empty defaults", async ({
  page,
}) => {
  await page.goto(behaviorStoryUrl);

  const submitButton = page.getByRole("button", {name: "Добавить расход", exact: true});
  await expect(submitButton).toBeEnabled();
  await expect(page.getByText("Введите сумму")).toHaveCount(0);
  await expect(page.getByText("Выберите категорию", {exact: true})).toHaveCount(0);
  await expect(page.locator("[data-invalid='true']")).toHaveCount(0);
  await expect(page.getByRole("button", {name: /Счёт.*Выберите счёт/})).toBeVisible();
  const today = await page.evaluate(() =>
    new Intl.DateTimeFormat("ru-RU", {day: "2-digit", month: "2-digit", year: "numeric"}).format(new Date())
  );
  await expect(page.getByRole("button", {name: `Дата ${today}`})).toBeVisible();

  await submitButton.click();

  await expect(page.getByText("Сумма должна быть больше 0")).toBeVisible();
  await expect(page.getByText("Выберите категорию", {exact: true})).toBeVisible();
  await expect(page.locator("[data-invalid='true']")).toHaveCount(3);
  await expect(submitButton).toBeEnabled();

  await page.getByPlaceholder("0").fill("100");
  await expect(page.getByText("Сумма должна быть больше 0")).toHaveCount(0);
  await expect(page.getByText("Выберите категорию", {exact: true})).toBeVisible();
  await expect(page.locator("[data-invalid='true']")).toHaveCount(2);
});

test("@integration comment length is validated on submit and its error clears after editing", async ({page}) => {
  await page.goto(behaviorStoryUrl);

  await page.getByPlaceholder("0").fill("100");
  await chooseCategoryFromAll(page, "Продукты");
  await chooseAccount(page);
  await page.getByRole("button", {name: /Комментарий/}).click();
  await page.getByPlaceholder("Например, продукты на неделю").fill("x".repeat(201));
  await page.getByRole("button", {name: "Готово", exact: true}).click();
  await page.getByRole("button", {name: "Добавить расход", exact: true}).click();

  await expect(page.getByText("Комментарий слишком длинный")).toBeVisible();
  await expect(page.getByRole("button", {name: "Добавить расход", exact: true})).toBeEnabled();

  await page.getByRole("button", {name: /Комментарий/}).click();
  await page.getByPlaceholder("Например, продукты на неделю").fill("Короткая заметка");
  await expect(page.getByText("Комментарий слишком длинный")).toHaveCount(0);
});

test("@integration category grid keeps its five items stable and temporarily promotes a new picker choice", async ({
  page,
}) => {
  await page.goto(behaviorStoryUrl);
  await expect(page.getByRole("button", {name: /Продукты/})).toBeVisible();

  const initialCategories = await quickCategoryNames(page);
  expect(initialCategories).toHaveLength(5);
  expect(initialCategories[0]).toContain("Продукты");
  expect(initialCategories[4]).toContain("Здоровье");

  await page.getByRole("button", {name: /Кофе/}).click();
  expect(await quickCategoryNames(page)).toEqual(initialCategories);

  await chooseCategoryFromAll(page, "Развлечения");
  const promotedCategories = await quickCategoryNames(page);
  expect(promotedCategories).toHaveLength(5);
  expect(promotedCategories[0]).toContain("Развлечения");
  expect(promotedCategories.at(-1)).not.toContain("Здоровье");
  await expect.poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories")).toBeNull();
});

test("@integration successful creation persists only its defaults and recent category", async ({page}) => {
  await page.goto(behaviorStoryUrl);

  await page.getByPlaceholder("0").fill("1250");
  await chooseCategoryFromAll(page, "Развлечения");
  await chooseAccount(page);
  await page.getByRole("button", {name: "Добавить расход", exact: true}).click();

  await expect
    .poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories"))
    .toEqual({
      expense: ["category-leisure"],
      income: [],
    });
  await expect
    .poll(() => readStorage<CreationDefaults>(page, "transaction-creation-defaults"))
    .toEqual(expect.objectContaining({accountId: "account-main"}));

  await page.getByRole("button", {name: "Открыть форму", exact: true}).click();
  await expect(page.getByRole("button", {name: /Счёт.*Основной счёт/})).toBeVisible();
  const categoriesWithPartialRecents = await quickCategoryNames(page);
  expect(categoriesWithPartialRecents).toHaveLength(5);
  expect(categoriesWithPartialRecents[0]).toContain("Развлечения");
  expect(categoriesWithPartialRecents[1]).toContain("Продукты");
  expect(categoriesWithPartialRecents.at(-1)).toContain("Дом");
});

test("@integration creation keeps expense and income recents separate", async ({page}) => {
  await page.goto(behaviorStoryUrl);
  await chooseAccount(page);

  await createExpense(page, "Продукты", 100);

  await expect
    .poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories"))
    .toEqual({
      expense: ["category-food"],
      income: [],
    });

  await page.getByRole("radio", {name: "Доход", exact: true}).click();
  await page.getByPlaceholder("0").fill("200");
  await chooseCategoryFromAll(page, "Зарплата");
  await page.getByRole("button", {name: "Добавить доход", exact: true}).click();

  await expect
    .poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories"))
    .toEqual({
      expense: ["category-food"],
      income: ["category-salary"],
    });
});

test("@integration editing and deleting a transaction do not change creation preferences", async ({page}) => {
  await page.goto(behaviorEditStoryUrl);
  const preferences: RecentCategories = {expense: ["category-transport"], income: ["category-salary"]};
  const defaults: CreationDefaults = {day: "2025-03-23", accountId: "account-main", date: "2025-03-23T09:30:00.000Z"};

  await expect(page.getByRole("button", {name: "Сохранить изменения", exact: true})).toBeVisible();

  await page.evaluate(
    ({nextDefaults, nextPreferences}) => {
      localStorage.setItem("transaction-creation-defaults", JSON.stringify(nextDefaults));
      localStorage.setItem("transaction-recent-categories", JSON.stringify(nextPreferences));
    },
    {nextDefaults: defaults, nextPreferences: preferences}
  );

  await page.getByRole("button", {name: /Комментарий/}).click();
  await page.getByPlaceholder("Например, продукты на неделю").fill("Обновлённая заметка");
  await page.getByRole("button", {name: "Готово", exact: true}).click();
  await page.getByRole("button", {name: "Сохранить изменения", exact: true}).click();

  await expect.poll(() => readStorage<CreationDefaults>(page, "transaction-creation-defaults")).toEqual(defaults);
  await expect.poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories")).toEqual(preferences);

  await page.getByRole("button", {name: "Открыть форму", exact: true}).click();
  await page.getByRole("button", {name: "Удалить операцию", exact: true}).click();

  await expect.poll(() => readStorage<CreationDefaults>(page, "transaction-creation-defaults")).toEqual(defaults);
  await expect.poll(() => readStorage<RecentCategories>(page, "transaction-recent-categories")).toEqual(preferences);
  await expect.poll(() => readStorage<{id: string}[]>(page, "transactions")).toEqual([]);
});
