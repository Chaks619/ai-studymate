import { useGetWorkspacesQuery } from "@/services/api/workspace.api";

export function useWorkspaces() {
  const {
    data: workspaces = [],
    isLoading,
    error,
    refetch,
  } = useGetWorkspacesQuery();

  return {
    workspaces,
    isLoading,
    error,
    refetch,
  };
}