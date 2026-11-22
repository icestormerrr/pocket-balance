import type {Meta, StoryObj} from "@storybook/react-vite";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider} from "@tanstack/react-router";

import {BottomBar} from "../../BottomBar";

function NavigationPreview({overContent = false}: {overContent?: boolean}) {
  const root = createRootRoute({
    component: () => (
      <main className="relative min-h-screen bg-background p-6">
        <h1 className="text-2xl font-semibold">Мои финансы</h1>
        <div className="mt-6 flex flex-col gap-4">
          {["Баланс", "Счета", "Последние операции"].map(title => (
            <section key={title} className="rounded-3xl bg-muted p-6">
              <h2>{title}</h2>
              <p className="mt-4 text-3xl">24 850 ₽</p>
            </section>
          ))}
        </div>
        {overContent && (
          <section aria-label="Счёт под меню" className="absolute inset-x-6 bottom-0 rounded-t-3xl bg-muted p-5">
            <h2 className="text-xl font-semibold">24 850 ₽</h2>
            <p className="mb-4 text-muted-foreground">Банковские карты</p>
            <div className="flex gap-3">
              {["9586", "9067", "4281"].map(number => (
                <div
                  key={number}
                  className="flex h-24 flex-1 items-end rounded-2xl bg-foreground/80 p-3 text-background"
                >
                  {number}
                </div>
              ))}
            </div>
          </section>
        )}
        <BottomBar />
      </main>
    ),
  });
  const routes = ["/accounts", "/transactions", "/reports", "/more"].map(path =>
    createRoute({getParentRoute: () => root, path})
  );
  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({initialEntries: ["/accounts"]}),
  });
  return <RouterProvider router={router} />;
}

const meta = {
  title: "Layout/Bottom Bar",
  component: NavigationPreview,
} satisfies Meta<typeof NavigationPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const OverContent: Story = {render: () => <NavigationPreview overContent />};
