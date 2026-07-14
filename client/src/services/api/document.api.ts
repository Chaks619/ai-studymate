import { baseApi } from "./baseApi";

import type {
  Document,
  DocumentListResponse,
  DocumentResponse,
} from "@/types/api/document.types";

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocument: builder.query<Document, string>({
      query: (id) => `/documents/${id}`,
      transformResponse: (response: DocumentResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Document", id },],
    }),

    getWorkspaceDocuments: builder.query< Document[], string>({
      query: (workspaceId) =>`/workspaces/${workspaceId}/documents`,
      transformResponse: (response: DocumentListResponse) => response.data,
      providesTags: ["Document"],
    }),

    uploadDocument: builder.mutation<Document,{
        workspaceId: string;
        formData: FormData;
    }>({
        query: ({ workspaceId, formData }) => ({
        url: `/workspaces/${workspaceId}/documents`,
        method: "POST",
        body: formData,
    }),
    transformResponse: (response: DocumentResponse) => response.data,
    invalidatesTags: ["Document","Workspace"],
    }),
  }),
});

export const {
  useGetDocumentQuery,
  useGetWorkspaceDocumentsQuery,
  useUploadDocumentMutation
} = documentApi;