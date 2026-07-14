import { useParams } from "react-router-dom";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader";

import { UploadDocumentButton } from "@/features/document/components/UploadDocumentButton";
import { EmptyDocuments } from "@/features/document/components/EmptyDocument";
import { DocumentGrid } from "@/features/document/components/DocumentGrid";

import { useGetWorkspaceQuery } from "@/services/api/workspace.api";
import { useDocuments } from "@/features/document/hooks/useDocument";

export function WorkspacePage() {
  const { workspaceId } = useParams();

  const {
    data: workspace,
    isLoading: workspaceLoading,
  } = useGetWorkspaceQuery(workspaceId!);

  const {
    documents,
    isLoading: documentsLoading,
  } = useDocuments(workspaceId!);

  if (workspaceLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          Loading workspace...
        </div>
      </DashboardLayout>
    );
  }

  if (!workspace) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          Workspace not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <WorkspaceHeader workspace={workspace} />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Documents
          </h2>

          <UploadDocumentButton />
        </div>

        {documentsLoading ? (
          <div className="flex items-center justify-center py-16">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <EmptyDocuments />
        ) : (
          <DocumentGrid documents={documents} />
        )}
      </div>
    </DashboardLayout>
  );
}