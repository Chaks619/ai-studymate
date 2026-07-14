import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DashboardPage } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { WorkspacePage } from "@/pages/Workspace";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspaces/:workspaceId",
    element: (
      <ProtectedRoute>
        <WorkspacePage />
      </ProtectedRoute>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}