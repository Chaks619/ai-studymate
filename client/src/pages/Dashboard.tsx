import { useMemo, useState } from "react";

import { DashboardHeader } from "@/features/workspace/components/DashboardHeader";
import { EmptyWorkspace } from "@/features/workspace/components/EmptyWorkspace";
import { WorkspaceGrid } from "@/features/workspace/components/WorkspaceGrid";
import { WorkspaceSkeleton } from "@/features/workspace/components/WorkspaceSkeleton";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspace";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function DashboardPage() {
  const { workspaces, isLoading } = useWorkspaces();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return workspaces;
    }

    return workspaces.filter((workspace) =>
      `${workspace.name} ${workspace.description}`
        .toLowerCase()
        .includes(term)
    );
  }, [workspaces, query]);

  const hasWorkspaces = workspaces.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader
          query={query}
          onQueryChange={setQuery}
          showSearch={hasWorkspaces}
        />

        {isLoading ? (
          <WorkspaceSkeleton />
        ) : !hasWorkspaces ? (
          <EmptyWorkspace />
        ) : (
          <div className="space-y-8">
            <DashboardStats workspaces={workspaces} />

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  No workspaces match{" "}
                  <span className="font-medium text-foreground">
                    “{query.trim()}”
                  </span>
                  .
                </p>
              </div>
            ) : (
              <WorkspaceGrid workspaces={filtered} />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
