import { useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";

import type { Workspace } from "@/types/api/workspace.types";

import { WorkspaceCardMenu } from "./WorkspaceCardMenu";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({
  workspace,
}: WorkspaceCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
      className="
        cursor-pointer
        rounded-xl
        border
        bg-card
        p-6
        transition-all
        duration-200
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      <div className="flex items-start justify-between">
        <FolderOpen
          className="h-8 w-8"
          style={{
            color: workspace.color,
          }}
        />

        <div
          onClick={(e) => e.stopPropagation()}
        >
          <WorkspaceCardMenu
            onRename={() =>
              console.log("Rename", workspace.id)
            }
            onColor={() =>
              console.log("Change Color", workspace.id)
            }
            onArchive={() =>
              console.log("Archive", workspace.id)
            }
            onDelete={() =>
              console.log("Delete", workspace.id)
            }
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="line-clamp-1 text-lg font-semibold">
          {workspace.name}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {workspace.description || "No description provided"}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Created{" "}
          {new Date(workspace.createdAt).toLocaleDateString()}
        </span>

        {workspace.lastOpenedAt && (
          <span>
            Opened{" "}
            {new Date(
              workspace.lastOpenedAt
            ).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}