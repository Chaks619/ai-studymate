import { WorkspaceCard } from "./WorkspaceCard";

import type { Workspace } from "@/types/api/workspace.types";

interface WorkspaceGridProps {
  workspaces: Workspace[];
}

export function WorkspaceGrid({
  workspaces,
}: WorkspaceGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
        />
      ))}
    </div>
  );
}