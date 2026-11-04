import type {Meta, StoryObj} from "@storybook/react-vite";
import {useState} from "react";
import {userEvent, within} from "storybook/test";

import {Button} from "@/shared/ui/button";
import TransactionFormDrawer from "../..";

const transaction = {
  id: "transaction-food",
  accountId: "account-main",
  categoryId: "category-food",
  amount: 4260,
  date: "2025-03-23T09:30:00.000Z",
  comment: "Продукты на неделю",
};

const loadFixture = () => {
  localStorage.removeItem("transaction-creation-defaults");
  localStorage.removeItem("transaction-recent-categories");
  localStorage.setItem(
    "accounts",
    JSON.stringify([
      {
        id: "account-main",
        name: "Основной счёт",
        currencyCode: "RUB",
        startAmount: 82500,
        creationDatetime: "2025-01-01T00:00:00.000Z",
      },
    ])
  );
  localStorage.setItem(
    "categories",
    JSON.stringify([
      {
        id: "category-food",
        name: "Продукты",
        shortName: "🛒",
        type: "expense",
        color: "#ef4444",
        creationDatetime: "2025-01-01T00:00:00.000Z",
      },
    ])
  );
  localStorage.setItem("transactions", JSON.stringify([transaction]));
  localStorage.setItem("ui-theme", "dark");
};

const behaviorCategories = [
  {id: "category-food", name: "Продукты", shortName: "🛒", type: "expense", color: "#ef4444"},
  {id: "category-coffee", name: "Кофе", shortName: "☕", type: "expense", color: "#f97316"},
  {id: "category-transport", name: "Транспорт", shortName: "🚕", type: "expense", color: "#eab308"},
  {id: "category-home", name: "Дом", shortName: "⌂", type: "expense", color: "#22c55e"},
  {id: "category-health", name: "Здоровье", shortName: "✚", type: "expense", color: "#06b6d4"},
  {id: "category-leisure", name: "Развлечения", shortName: "🎬", type: "expense", color: "#8b5cf6"},
  {id: "category-salary", name: "Зарплата", shortName: "💼", type: "income", color: "#10b981"},
  {id: "category-cashback", name: "Кешбэк", shortName: "↗", type: "income", color: "#14b8a6"},
];

const loadBehaviorFixture = () => {
  localStorage.clear();
  localStorage.setItem(
    "accounts",
    JSON.stringify([
      {
        id: "account-main",
        name: "Основной счёт",
        currencyCode: "RUB",
        startAmount: 82500,
        creationDatetime: "2025-01-01T00:00:00.000Z",
      },
    ])
  );
  localStorage.setItem(
    "categories",
    JSON.stringify(behaviorCategories.map(category => ({...category, creationDatetime: "2025-01-01T00:00:00.000Z"})))
  );
  localStorage.setItem("transactions", JSON.stringify([transaction]));
  localStorage.setItem("ui-theme", "dark");
};

function TransactionFormHarness({transactionId}: {transactionId?: string}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Открыть форму</Button>
      <TransactionFormDrawer open={open} onOpenChange={setOpen} transactionId={transactionId} />
    </div>
  );
}

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
export const ValidationErrors: Story = {
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole("button", {name: "Добавить расход"}));
  },
};

export const Behavior: Story = {
  loaders: [loadBehaviorFixture],
  render: () => <TransactionFormHarness />,
};

export const BehaviorEdit: Story = {
  loaders: [loadBehaviorFixture],
  render: () => <TransactionFormHarness transactionId={transaction.id} />,
};
