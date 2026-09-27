import type {Meta, StoryObj} from "@storybook/react-vite";

import CategoryFormDrawer from "../..";

const category = {
  id: "category-food",
  name: "Продукты",
  shortName: "🛒",
  type: "expense" as const,
  color: "#ef4444",
  creationDatetime: "2025-01-01T00:00:00.000Z",
};

const loadCategories = async () => {
  localStorage.setItem("categories", JSON.stringify([category]));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Widgets/CategoryFormDrawer",
  component: CategoryFormDrawer,
  args: {open: true, onOpenChange: () => undefined, categoryId: undefined},
  loaders: [loadCategories],
} satisfies Meta<typeof CategoryFormDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
export const Edit: Story = {args: {categoryId: category.id}};
