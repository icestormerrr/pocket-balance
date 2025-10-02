export const URLS = {
  MainPage: {
    path: "/",
    build: () => "/",
  },
  AccountsPage: {
    path: "/accounts",
    build: () => "/accounts",
  },
  TransactionsPage: {
    path: "/transactions",
    build: () => "/transactions",
  },
  CategoriesPage: {
    path: "/categories",
    build: () => "/categories",
  },
  ReportsPage: {
    path: "/reports",
    build: () => "/reports",
  },
  MorePage: {
    path: "/more",
    build: () => "/more",
  },
} as const;
