import type {Meta, StoryObj} from "@storybook/react-vite";

import TransactionsPage from ".";

const fixture = {
  accounts: [
    {
      id: "account-main",
      name: "Основной счёт",
      currencyCode: "RUB",
      startAmount: 75000,
      creationDatetime: "2025-01-01T00:00:00.000Z",
    },
  ],
  categories: [
    {
      id: "category-salary",
      name: "Зарплата",
      shortName: "💼",
      type: "income",
      creationDatetime: "2025-01-01T00:00:00.000Z",
      color: "#22c55e",
    },
    {
      id: "category-food",
      name: "Продукты",
      shortName: "🛒",
      type: "expense",
      creationDatetime: "2025-01-01T00:00:00.000Z",
      color: "#ef4444",
    },
    {
      id: "category-transport",
      name: "Транспорт",
      shortName: "🚌",
      type: "expense",
      creationDatetime: "2025-01-01T00:00:00.000Z",
      color: "#f59e0b",
    },
  ],
  transactions: [
    {
      id: "transaction-salary",
      accountId: "account-main",
      categoryId: "category-salary",
      amount: 120000,
      date: "2025-03-23T12:00:00.000Z",
      comment: "Зарплата за март",
    },
    {
      id: "transaction-food",
      accountId: "account-main",
      categoryId: "category-food",
      amount: 4260,
      date: "2025-03-23T09:30:00.000Z",
      comment: "Продукты на неделю",
    },
    {
      id: "transaction-transport",
      accountId: "account-main",
      categoryId: "category-transport",
      amount: 180,
      date: "2025-03-22T08:15:00.000Z",
      comment: "Метро",
    },
  ],
};

const loadFixture = (transactions = fixture.transactions) => {
  localStorage.setItem("accounts", JSON.stringify(fixture.accounts));
  localStorage.setItem("categories", JSON.stringify(fixture.categories));
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Pages/Transactions",
  component: TransactionsPage,
  loaders: [
    async () => {
      loadFixture();
    },
  ],
  args: {
    initialDateFilter: {
      startDate: "2025-03-01T00:00:00.000Z",
      endDate: "2025-03-31T23:59:59.999Z",
    },
  },
} satisfies Meta<typeof TransactionsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  loaders: [
    async () => {
      loadFixture([]);
    },
  ],
};
