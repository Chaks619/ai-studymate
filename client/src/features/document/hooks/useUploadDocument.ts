import { useUploadDocumentMutation } from "@/services/api/document.api";

export function useUploadDocument() {
  const [
    uploadDocument,
    {
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useUploadDocumentMutation();

  return {
    uploadDocument,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}