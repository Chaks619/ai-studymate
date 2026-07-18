import { WorkspaceCard } from "./WorkspaceCard";

import type { Workspace } from "@/types/api/workspace.types";

interface WorkspaceGridProps {
  workspaces: Workspace[];
}

export function WorkspaceGrid({
  workspaces,
}: WorkspaceGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace, index) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          index={index}
        />
      ))}
    </div>
  );
}
