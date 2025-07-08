import {
    RouterProvider,
    createRootRoute,
    createRoute,
    createRouter, Outlet,
} from '@tanstack/react-router';


const rootRoute = createRootRoute({
    component: () => <div><Outlet /></div>,
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <h1>Home</h1>,
});

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: () => <h1>About</h1>,
});


const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);


export const router = createRouter({ routeTree });

// declare module '@tanstack/react-router' {
//     interface Register {
//         router: typeof router;
//     }
// }

export default function App() {
    return <RouterProvider router={router} />;
}
