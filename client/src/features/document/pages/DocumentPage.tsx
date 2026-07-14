import { useParams } from "react-router-dom";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { useGetDocumentQuery } from "@/services/api/document.api";

export function DocumentPage() {
  const { documentId } = useParams();

  const {
    data: document,
    isLoading,
  } = useGetDocumentQuery(documentId!);

  if (isLoading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        Document not found.
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <h1 className="text-3xl font-bold">
          {document.title}
        </h1>

        <p className="text-muted-foreground">
          {document.description}
        </p>

      </div>
    </DashboardLayout>
  );
}