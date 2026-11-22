import type {Meta, StoryObj} from "@storybook/react-vite";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider} from "@tanstack/react-router";
import type {ReactNode} from "react";

import {ThemeProvider} from "@/ui/shared/lib/theme";

import MorePage from ".";

const setTheme = (theme: "dark" | "light") => {
  localStorage.setItem("ui-theme", theme);
  localStorage.removeItem("storybook-more-theme");
  return {};
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
  decorators: [withRouter],
} satisfies Meta<typeof MorePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {loaders: [() => setTheme("dark")]};

export const LightTheme: Story = {loaders: [() => setTheme("light")]};

export const SystemTheme: Story = {
  loaders: [() => setTheme("dark")],
  decorators: [
    Story => (
      <ThemeProvider defaultTheme="system" storageKey="storybook-more-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};
