import type {Meta, StoryObj} from "@storybook/react-vite";

import TransactionFormDrawer from "../..";

const transaction = {
  id: "transaction-food",
  accountId: "account-main",
  categoryId: "category-food",
  amount: 4260,
  date: "2025-03-23T09:30:00.000Z",
  comment: "Продукты на неделю",
};

const loadFixture = async () => {
  localStorage.setItem(
    "accounts",
    JSON.stringify([
      {id: "account-main", name: "Основной счёт", currencyCode: "RUB", startAmount: 82500, creationDatetime: "2025-01-01T00:00:00.000Z"},
    ])
  );
  localStorage.setItem(
    "categories",
    JSON.stringify([
      {id: "category-food", name: "Продукты", shortName: "🛒", type: "expense", color: "#ef4444", creationDatetime: "2025-01-01T00:00:00.000Z"},
    ])
  );
  localStorage.setItem("transactions", JSON.stringify([transaction]));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Widgets/TransactionFormDrawer",
  component: TransactionFormDrawer,
  args: {open: true, onOpenChange: () => undefined},
  loaders: [loadFixture],
} satisfies Meta<typeof TransactionFormDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
export const Edit: Story = {args: {transactionId: transaction.id}};
