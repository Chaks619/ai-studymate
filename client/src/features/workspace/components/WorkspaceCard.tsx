import { useNavigate } from "react-router-dom";
import { CalendarClock, FolderOpen } from "lucide-react";

import { formatRelativeDate } from "@/lib/format";
import type { Workspace } from "@/types/api/workspace.types";

import { WorkspaceCardMenu } from "./WorkspaceCardMenu";

interface WorkspaceCardProps {
  workspace: Workspace;
  index?: number;
}

export function WorkspaceCard({
  workspace,
  index = 0,
}: WorkspaceCardProps) {
  const navigate = useNavigate();

  const opened = workspace.lastOpenedAt
    ? `Opened ${formatRelativeDate(
        workspace.lastOpenedAt
      ).toLowerCase()}`
    : `Created ${formatRelativeDate(
        workspace.createdAt
      ).toLowerCase()}`;

  return (
    <div
      onClick={() =>
        navigate(`/workspaces/${workspace.id}`)
      }
      style={{ animationDelay: `${index * 55}ms` }}
      className="animate-enter group relative cursor-pointer overflow-hidden rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/[0.07] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-foreground/12"
    >
      {/* The theme accent as a quiet top accent — follows the user's chosen
          accent colour (the --primary token) rather than a fixed hue. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-primary opacity-80 transition-opacity group-hover:opacity-100"
      />

      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FolderOpen className="size-5" />
        </span>

        <div onClick={(event) => event.stopPropagation()}>
          <WorkspaceCardMenu
            onRename={() => {}}
            onArchive={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="line-clamp-1 font-heading font-semibold tracking-tight text-foreground">
          {workspace.name}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {workspace.description || "No description"}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarClock className="size-3.5 opacity-70" />
        {opened}
      </div>
    </div>
  );
}
