import type {Meta, StoryObj} from "@storybook/react-vite";

import CategoriesPage from ".";

const categories = [
  {
    id: "category-groceries",
    name: "Продукты",
    shortName: "🛒",
    type: "expense" as const,
    creationDatetime: "2025-01-01T00:00:00.000Z",
    color: "#ef4444",
  },
  {
    id: "category-transport",
    name: "Транспорт",
    shortName: "🚌",
    type: "expense" as const,
    creationDatetime: "2025-01-02T00:00:00.000Z",
    color: "#f59e0b",
  },
  {
    id: "category-home",
    name: "Дом",
    shortName: "🏠",
    type: "expense" as const,
    creationDatetime: "2025-01-03T00:00:00.000Z",
    color: "#8b5cf6",
  },
  {
    id: "category-salary",
    name: "Зарплата",
    shortName: "💼",
    type: "income" as const,
    creationDatetime: "2025-01-04T00:00:00.000Z",
    color: "#22c55e",
  },
  {
    id: "category-cashback",
    name: "Кешбэк",
    shortName: "💳",
    type: "income" as const,
    creationDatetime: "2025-01-05T00:00:00.000Z",
    color: "#06b6d4",
  },
];

const setCategories = (items: typeof categories) => {
  localStorage.setItem("categories", JSON.stringify(items));
  localStorage.setItem("ui-theme", "dark");
};

const meta = {
  title: "Pages/Categories",
  component: CategoriesPage,
  loaders: [async () => setCategories(categories)],
} satisfies Meta<typeof CategoriesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  loaders: [async () => setCategories([])],
};
