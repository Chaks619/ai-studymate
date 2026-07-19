import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { DashboardPage } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { WorkspacePage } from "@/pages/Workspace";
import { DocumentPage } from "@/features/document/pages/DocumentPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { DEFAULT_SETTINGS_SECTION } from "@/features/settings/settings.constants";
import { MinigamesPage } from "@/features/minigames/pages/MinigamesPage";
import { ChessPage } from "@/features/minigames/pages/ChessPage";
import { TicTacToePage } from "@/features/minigames/pages/TicTacToePage";
import { MemoryMatchPage } from "@/features/minigames/pages/MemoryMatchPage";
import { Game2048Page } from "@/features/minigames/pages/Game2048Page";
import { SpeedMathPage } from "@/features/minigames/pages/SpeedMathPage";

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
    path: "/minigames",
    element: (
      <ProtectedRoute>
        <MinigamesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/minigames/chess",
    element: (
      <ProtectedRoute>
        <ChessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/minigames/tic-tac-toe",
    element: (
      <ProtectedRoute>
        <TicTacToePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/minigames/memory",
    element: (
      <ProtectedRoute>
        <MemoryMatchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/minigames/2048",
    element: (
      <ProtectedRoute>
        <Game2048Page />
      </ProtectedRoute>
    ),
  },
  {
    path: "/minigames/speed-math",
    element: (
      <ProtectedRoute>
        <SpeedMathPage />
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