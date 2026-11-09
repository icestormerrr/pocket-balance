import type {Meta, StoryObj} from "@storybook/react-vite";

import TransferFormDrawer from "../..";

const transferId = "transfer-march";

const loadFixture = async () => {
  localStorage.setItem(
    "accounts",
    JSON.stringify([
      {id: "account-main", name: "Основной счёт", currencyCode: "RUB", startAmount: 82500, creationDatetime: "2025-01-01T00:00:00.000Z"},
      {id: "account-savings", name: "Накопления", currencyCode: "RUB", startAmount: 150000, creationDatetime: "2025-01-01T00:00:00.000Z"},
    ])
  );
  localStorage.setItem(
    "transactions",
    JSON.stringify([
      {id: "transfer-out", accountId: "account-main", categoryId: "transfer_out", amount: 10000, date: "2025-03-20T12:00:00.000Z", transferId},
      {id: "transfer-in", accountId: "account-savings", categoryId: "transfer_in", amount: 10000, date: "2025-03-20T12:00:00.000Z", transferId},
    ])
  );
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Widgets/TransferFormDrawer",
  component: TransferFormDrawer,
  args: {open: true, onOpenChange: () => undefined},
  loaders: [loadFixture],
} satisfies Meta<typeof TransferFormDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
export const Edit: Story = {args: {transferId}};
