import { baseApi } from "./baseApi";

export interface Flashcard {
  id: string;
  document: string;
  title: string;
  status: string;
  model: string;
  generationTimeMs: number;

  cards: {
    question: string;
    answer: string;
    difficulty: "easy" | "medium" | "hard";
  }[];

  createdAt: string;
  updatedAt: string;
}

interface FlashcardResponse {
  success: boolean;
  message: string;
  data: Flashcard;
}

interface GenerateFlashcardsRequest {
  cardCount: number;
}

export const flashcardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFlashcards: builder.query<
      Flashcard,
      string
    >({
      query: (documentId) =>
        `/documents/${documentId}/flashcards`,

      transformResponse: (
        response: FlashcardResponse
      ) => response.data,

      providesTags: ["Flashcard"],
    }),

    generateFlashcards: builder.mutation<
      Flashcard,
      {
        documentId: string;
        body: GenerateFlashcardsRequest;
      }
    >({
      query: ({ documentId, body }) => ({
        url: `/documents/${documentId}/flashcards`,
        method: "POST",
        body,
      }),

      transformResponse: (
        response: FlashcardResponse
      ) => response.data,

      invalidatesTags: ["Flashcard","Document"],
    }),
  }),
});

export const {
  useGetFlashcardsQuery,
  useGenerateFlashcardsMutation,
} = flashcardApi;