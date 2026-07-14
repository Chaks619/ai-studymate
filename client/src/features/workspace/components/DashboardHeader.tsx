import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          My Workspaces
        </h1>

        <p className="text-muted-foreground">
          Organize your study materials.
        </p>
      </div>

      <CreateWorkspaceDialog />
    </div>
  );
}