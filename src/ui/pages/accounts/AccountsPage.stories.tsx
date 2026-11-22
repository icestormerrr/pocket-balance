import type {Transaction} from "@/core/transaction/domain/Transaction";
import type {Meta, StoryObj} from "@storybook/react-vite";

import AccountsPage from ".";

const populatedAccounts = [
  {
    id: "account-card",
    name: "Банковская карта",
    currencyCode: "RUB",
    startAmount: 82450,
    creationDatetime: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "account-cash",
    name: "Наличные",
    currencyCode: "RUB",
    startAmount: 5350,
    creationDatetime: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "account-savings",
    name: "Накопления",
    currencyCode: "RUB",
    startAmount: 150000,
    creationDatetime: "2025-01-03T00:00:00.000Z",
  },
];

const balanceTransactions: Transaction[] = [
  {id: "old-income", accountId: "account-card", categoryId: "income", amount: 5000, date: "2025-02-28T12:00:00Z"},
  {id: "salary", accountId: "account-card", categoryId: "income", amount: 30000, date: "2025-03-01T12:00:00Z"},
  {id: "expense", accountId: "account-card", categoryId: "expense", amount: 4500, date: "2025-03-14T12:00:00Z"},
  {id: "cash-expense", accountId: "account-cash", categoryId: "expense", amount: 1000, date: "2025-03-02T12:00:00Z"},
  {
    id: "transfer-in",
    accountId: "account-card",
    categoryId: "transfer_in",
    amount: 2000,
    date: "2025-03-15T12:00:00Z",
    transferId: "transfer",
  },
  {
    id: "transfer-out",
    accountId: "account-cash",
    categoryId: "transfer_out",
    amount: 2000,
    date: "2025-03-15T12:00:00Z",
    transferId: "transfer",
  },
  {id: "future-expense", accountId: "account-card", categoryId: "expense", amount: 7000, date: "2025-03-25T12:00:00Z"},
  {id: "next-month", accountId: "account-card", categoryId: "expense", amount: 9000, date: "2025-04-01T12:00:00Z"},
];

const setStorage = (accounts: typeof populatedAccounts, transactions: Transaction[] = []) => {
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem(
    "categories",
    JSON.stringify([
      {
        id: "income",
        name: "Доход",
        type: "income",
        shortName: "+",
        color: "#22c55e",
        creationDatetime: "2025-01-01T00:00:00Z",
      },
      {
        id: "expense",
        name: "Расход",
        type: "expense",
        shortName: "-",
        color: "#ef4444",
        creationDatetime: "2025-01-01T00:00:00Z",
      },
    ])
  );
  localStorage.setItem("ui-theme", "dark");
  return {};
};

const loadBalanceChanges = (theme: "dark" | "light") => {
  setStorage(populatedAccounts, balanceTransactions);
  localStorage.setItem("ui-theme", theme);
  return {};
};

const meta = {
  title: "Pages/Accounts",
  component: AccountsPage,
} satisfies Meta<typeof AccountsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {loaders: [() => setStorage(populatedAccounts)]};

export const Empty: Story = {
  loaders: [() => setStorage([])],
};

export const BalanceChanges: Story = {loaders: [() => loadBalanceChanges("dark")]};
export const BalanceChangesLight: Story = {loaders: [() => loadBalanceChanges("light")]};
