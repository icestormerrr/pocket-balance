import {createRootRoute, createRoute, createRouter} from "@tanstack/react-router";

import CategoriesPage from "@/pages/categories";
import MorePage from "@/pages/more";
import ReportsPage from "@/pages/reports";
import TransactionsPage from "@/pages/transactions";

import {RootLayout} from "@/app/layout/RootLayout";
import AccountsPage from "@/pages/accounts";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const mainPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TransactionsPage,
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accounts",
  component: AccountsPage,
});
const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transactions",
  component: TransactionsPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories",
  component: CategoriesPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/more",
  component: MorePage,
});

const routeTree = rootRoute.addChildren([
  mainPage,
  accountsRoute,
  transactionsRoute,
  reportsRoute,
  categoriesRoute,
  settingsRoute,
]);

export const router = createRouter({routeTree});
