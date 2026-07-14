import { toast } from "sonner";

import { useCreateWorkspaceMutation } from "@/services/api/workspace.api";

import type { CreateWorkspaceRequest } from "@/types/api/workspace.types";

interface UseCreateWorkspaceProps {
  onSuccess?: () => void;
}

export function useCreateWorkspace({
  onSuccess,
}: UseCreateWorkspaceProps = {}) {
  const [createWorkspaceMutation, { isLoading }] =
    useCreateWorkspaceMutation();

  const createWorkspace = async (
    data: CreateWorkspaceRequest
  ) => {
    try {
      await createWorkspaceMutation(data).unwrap();

      toast.success("Workspace created successfully");

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create workspace");
    }
  };

  return {
    createWorkspace,
    isLoading,
  };
}