import {RouterProvider} from "@tanstack/react-router";
import {router} from "./router/router.tsx";
import './styles/globals.css';

function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
