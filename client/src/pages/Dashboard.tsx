import { DashboardHeader } from "@/features/workspace/components/DashboardHeader";
import { EmptyWorkspace } from "@/features/workspace/components/EmptyWorkspace";
import { WorkspaceGrid } from "@/features/workspace/components/WorkspaceGrid";
import { WorkspaceSkeleton } from "@/features/workspace/components/WorkspaceSkeleton";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspace";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function DashboardPage() {
  const {
    workspaces,
    isLoading,
  } = useWorkspaces();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />

        {isLoading ? (
          <WorkspaceSkeleton />
        ) : workspaces.length === 0 ? (
          <EmptyWorkspace />
        ) : (
          <WorkspaceGrid workspaces={workspaces} />
        )}
      </div>
    </DashboardLayout>
  );
}