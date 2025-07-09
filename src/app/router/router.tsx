import {
    createRootRoute,
    createRoute,
    createRouter, Outlet,
} from '@tanstack/react-router';
import {AnimationProvider} from "../layout/AnimationProvider.tsx";
import {BottomBar} from "../layout/bottom-bar/BottomBar.tsx";
import {Toaster} from "../../shared/ui/sonner.tsx";
import CategoriesPage from "../../pages/categories/page.tsx";
import OperationsPage from "../../pages/operations/page.tsx";
import ReportsPage from "../../pages/reports/page.tsx";
import SettingsPage from "../../pages/settings/page.tsx";

const rootRoute = createRootRoute({
    component: () => <><AnimationProvider><Outlet /></AnimationProvider>
        <BottomBar />
        <Toaster /></>,
});

const operationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/operations',
    component: OperationsPage,
});

const categoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/categories',
    component: CategoriesPage,
});

const reportsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reports',
    component: ReportsPage,
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage,
});

const routeTree = rootRoute.addChildren([operationsRoute, categoriesRoute, reportsRoute, settingsRoute]);


export const router = createRouter({ routeTree });

// declare module '@tanstack/react-router' {
//     interface Register {
//         router: typeof router;
//     }
// }
