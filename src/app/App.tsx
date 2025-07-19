import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "@tanstack/react-router";

import {ThemeProvider} from "@/shared/lib/theme";
import {router} from "./router/router";
import "./styles/globals.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
