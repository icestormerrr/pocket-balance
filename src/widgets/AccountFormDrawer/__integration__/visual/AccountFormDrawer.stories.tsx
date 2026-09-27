import type {Meta, StoryObj} from "@storybook/react-vite";

import AccountFormDrawer from "../..";

const account = {
  id: "account-main",
  name: "Основной счёт",
  currencyCode: "RUB",
  startAmount: 82500,
  creationDatetime: "2025-01-01T00:00:00.000Z",
};

const loadAccounts = async () => {
  localStorage.setItem("accounts", JSON.stringify([account]));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Widgets/AccountFormDrawer",
  component: AccountFormDrawer,
  args: {open: true, onOpenChange: () => undefined},
  loaders: [loadAccounts],
} satisfies Meta<typeof AccountFormDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
export const Edit: Story = {args: {accountId: account.id}};
