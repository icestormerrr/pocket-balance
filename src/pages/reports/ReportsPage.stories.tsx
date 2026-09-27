import type {Meta, StoryObj} from "@storybook/react-vite";

import ReportsPage from ".";

const reportPeriod = {
  startDate: "2025-03-01T00:00:00.000Z",
  endDate: "2025-03-31T23:59:59.999Z",
};

const populatedFixture = {
  accounts: [
    {id: "main", name: "Основной счёт", currencyCode: "RUB", startAmount: 75000, creationDatetime: "2025-01-01T00:00:00.000Z"},
    {id: "savings", name: "Накопления", currencyCode: "RUB", startAmount: 100000, creationDatetime: "2025-01-01T00:00:00.000Z"},
  ],
  categories: [
    {id: "salary", name: "Зарплата", shortName: "💼", type: "income", color: "#22c55e", creationDatetime: "2025-01-01T00:00:00.000Z"},
    {id: "food", name: "Продукты", shortName: "🛒", type: "expense", color: "#ef4444", creationDatetime: "2025-01-01T00:00:00.000Z"},
    {id: "transport", name: "Транспорт", shortName: "🚌", type: "expense", color: "#f59e0b", creationDatetime: "2025-01-01T00:00:00.000Z"},
    {id: "home", name: "Дом", shortName: "🏠", type: "expense", color: "#8b5cf6", creationDatetime: "2025-01-01T00:00:00.000Z"},
  ],
  transactions: [
    {id: "feb-salary", accountId: "main", categoryId: "salary", amount: 110000, date: "2025-02-10T12:00:00.000Z"},
    {id: "feb-food", accountId: "main", categoryId: "food", amount: 18000, date: "2025-02-12T12:00:00.000Z"},
    {id: "feb-transport", accountId: "main", categoryId: "transport", amount: 4000, date: "2025-02-15T12:00:00.000Z"},
    {id: "march-salary", accountId: "main", categoryId: "salary", amount: 125000, date: "2025-03-10T12:00:00.000Z"},
    {id: "march-food", accountId: "main", categoryId: "food", amount: 24500, date: "2025-03-12T12:00:00.000Z"},
    {id: "march-transport", accountId: "main", categoryId: "transport", amount: 2500, date: "2025-03-18T12:00:00.000Z"},
    {id: "march-home", accountId: "savings", categoryId: "home", amount: 8000, date: "2025-03-21T12:00:00.000Z"},
  ],
};

const writeFixture = (fixture: typeof populatedFixture) => () => {
  localStorage.setItem("accounts", JSON.stringify(fixture.accounts));
  localStorage.setItem("categories", JSON.stringify(fixture.categories));
  localStorage.setItem("transactions", JSON.stringify(fixture.transactions));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Pages/Reports",
  component: ReportsPage,
  loaders: [writeFixture(populatedFixture)],
  args: {initialDateFilter: reportPeriod},
} satisfies Meta<typeof ReportsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cashflow: Story = {};

export const ExpenseInsights: Story = {
  args: {initialActiveReportKey: "expense_insights"},
};

export const PeriodComparison: Story = {
  args: {initialActiveReportKey: "period_comparison"},
};

export const AccountFlow: Story = {
  args: {initialActiveReportKey: "account_flow"},
};

export const Empty: Story = {
  loaders: [
    writeFixture({accounts: populatedFixture.accounts, categories: populatedFixture.categories, transactions: []}),
  ],
};
