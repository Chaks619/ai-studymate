import { baseApi } from "./baseApi";

import type {
  Workspace,
  WorkspaceListResponse,
  WorkspaceResponse,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/api/workspace.types";

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => "/workspaces",
      transformResponse: (response: WorkspaceListResponse) => response.data,
      providesTags: ["Workspace"],
    }),

    getWorkspace: builder.query<Workspace, string>({
      query: (id) => `/workspaces/${id}`,
      transformResponse: (response: WorkspaceResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Workspace", id },],
    }),

    createWorkspace: builder.mutation<WorkspaceResponse, CreateWorkspaceRequest>({
      query: (body) => ({
        url: "/workspaces",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workspace"],
    }),

    updateWorkspace: builder.mutation<WorkspaceResponse,{
        id: string;
        body: UpdateWorkspaceRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/workspaces/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Workspace"],
    }),

    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;