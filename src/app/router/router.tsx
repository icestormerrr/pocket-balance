import {createRootRoute, createRoute, createRouter, Outlet} from "@tanstack/react-router";

import CategoriesPage from "@/pages/categories/page.tsx";
import MainPage from "@/pages/main";
import ReportsPage from "@/pages/reports/page.tsx";
import SettingsPage from "@/pages/settings/page.tsx";
import TransactionsPage from "@/pages/transactions/page.tsx";
import {Toaster} from "@/shared/ui/sonner.tsx";

import {AnimationProvider} from "../layout/AnimationProvider.tsx";
import {BottomBar} from "../layout/bottom-bar/BottomBar.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AnimationProvider>
        <Outlet />
      </AnimationProvider>
      <BottomBar />
      <Toaster />
    </>
  ),
});

const mainPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MainPage,
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
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([mainPage, transactionsRoute, reportsRoute, categoriesRoute, settingsRoute]);

export const router = createRouter({routeTree});
