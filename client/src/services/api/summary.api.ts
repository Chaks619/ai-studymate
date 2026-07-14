import { baseApi } from "./baseApi";

export interface Summary {
  id: string;
  document: string;
  content: string;
  status: string;
  model: string;
  generationTimeMs: number;
  createdAt: string;
  updatedAt: string;
}

interface SummaryResponse {
  success: boolean;
  message: string;
  data: Summary;
}

export const summaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummary: builder.query<Summary, string>({
      query: (documentId) =>
        `/documents/${documentId}/summary`,

      transformResponse: (
        response: SummaryResponse
      ) => response.data,

      providesTags: ["Summary"],
    }),

    generateSummary: builder.mutation<
      Summary,
      string
    >({
      query: (documentId) => ({
        url: `/documents/${documentId}/summary`,
        method: "POST",
      }),

      transformResponse: (
        response: SummaryResponse
      ) => response.data,

      invalidatesTags: ["Summary", "Document"],
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGenerateSummaryMutation,
} = summaryApi;