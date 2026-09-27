import type {Preview} from "@storybook/react-vite";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import type {ReactNode} from "react";

import "../src/app/styles/globals.css";
import {ThemeProvider} from "../src/shared/lib/theme";

const MOBILE_VIEWPORT = {
  name: "Mobile",
  styles: {width: "390px", height: "844px"},
  type: "mobile",
} as const;

const withAppProviders = (Story: () => ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <div className="mx-auto min-h-screen w-full max-w-md bg-background">
          <Story />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  decorators: [withAppProviders],
  parameters: {
    layout: "fullscreen",
    viewport: {
      viewports: {mobile: MOBILE_VIEWPORT},
      defaultViewport: "mobile",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
