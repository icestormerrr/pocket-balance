import type {Meta, StoryObj} from "@storybook/react-vite";
import type {ReactNode} from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

import {ThemeProvider} from "@/shared/lib/theme";

import MorePage from ".";

const setDarkTheme = () => {
  localStorage.setItem("ui-theme", "dark");
  localStorage.removeItem("storybook-more-theme");
};

const withRouter = (Story: () => ReactNode) => {
  const rootRoute = createRootRoute({component: Story});
  const categoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/categories",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([categoriesRoute]),
    history: createMemoryHistory({initialEntries: ["/"]}),
  });

  return <RouterProvider router={router} />;
};

const meta = {
  title: "Pages/More",
  component: MorePage,
  loaders: [async () => setDarkTheme()],
  decorators: [
    withRouter,
  ],
} satisfies Meta<typeof MorePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SystemTheme: Story = {
  decorators: [
    Story => (
      <ThemeProvider defaultTheme="system" storageKey="storybook-more-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};
