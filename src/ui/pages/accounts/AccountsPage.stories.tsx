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

const setStorage = (accounts: typeof populatedAccounts) => {
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("transactions", "[]");
  localStorage.setItem("categories", "[]");
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Pages/Accounts",
  component: AccountsPage,
  loaders: [async () => setStorage(populatedAccounts)],
} satisfies Meta<typeof AccountsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  loaders: [async () => setStorage([])],
};
