import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { DashboardPage } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { WorkspacePage } from "@/pages/Workspace";
import { DocumentPage } from "@/features/document/pages/DocumentPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { DEFAULT_SETTINGS_SECTION } from "@/features/settings/settings.constants";

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
  {
    path: "/documents/:documentId",
    element: (
        <ProtectedRoute>
        <DocumentPage />
        </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: <Navigate to={`/settings/${DEFAULT_SETTINGS_SECTION}`} replace />,
  },
  {
    path: "/settings/:section",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}