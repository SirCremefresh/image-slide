import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { Editor } from "./pages/editor/Editor.tsx";
import Viewer from "./pages/Viewer.tsx";
import { Home } from "./pages/Home.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "edit/:collectionId/:secret",
    element: <Editor />,
  },
  {
    path: "view/:collectionId",
    element: <Viewer />,
  },
  {
    path: "view/:collectionId/:imageId",
    element: <Viewer />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
