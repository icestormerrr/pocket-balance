import {createRootRoute, createRoute, createRouter, Outlet} from "@tanstack/react-router";

import CategoriesPage from "@/pages/categories";
import MainPage from "@/pages/main";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import TransactionsPage from "@/pages/transactions";
import {Toaster} from "@/shared/ui/sonner.tsx";

import {AnimationWrapper} from "@/app/layout/AnimationWrapper/AnimationWrapper.tsx";
import {BottomBar} from "../layout/BottomBar/BottomBar.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AnimationWrapper>
        <Outlet />
      </AnimationWrapper>
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
