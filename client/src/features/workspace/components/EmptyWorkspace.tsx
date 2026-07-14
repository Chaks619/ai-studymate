import { FolderOpen } from "lucide-react";

import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

export function EmptyWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
      <FolderOpen className="mb-4 h-14 w-14 text-muted-foreground" />

      <h2 className="text-xl font-semibold">
        No workspaces yet
      </h2>

      <p className="mt-2 text-muted-foreground">
        Create your first workspace to organize your study material.
      </p>

      <div className="mt-8">
        <CreateWorkspaceDialog />
      </div>
    </div>
  );
}