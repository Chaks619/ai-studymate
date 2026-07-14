import { useGetWorkspaceDocumentsQuery } from "@/services/api/document.api";

export function useDocuments(
  workspaceId: string
) {
  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useGetWorkspaceDocumentsQuery(workspaceId);

  return {
    documents,
    isLoading,
    error,
    refetch,
  };
}