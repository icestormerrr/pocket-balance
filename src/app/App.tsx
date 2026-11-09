import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "@tanstack/react-router";

import {ThemeProvider} from "@/ui/shared/lib/theme";
import {AppServicesProvider} from "./AppServicesProvider";
import {router} from "./router/router";
import "./styles/globals.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );
}

export default App;
