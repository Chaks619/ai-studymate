import { baseApi } from "./baseApi";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  document: string;
  title: string;
  status: string;
  model: string;
  generationTimeMs: number;

  questions: QuizQuestion[];

  createdAt: string;
  updatedAt: string;
}

interface QuizResponse {
  success: boolean;
  message: string;
  data: Quiz;
}

interface GenerateQuizRequest {
  questionCount: number;
  difficulty: string
}

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuiz: builder.query<Quiz, string>({
      query: (documentId) =>
        `/documents/${documentId}/quiz`,

      transformResponse: (
        response: QuizResponse
      ) => response.data,

      providesTags: ["Quiz"],
    }),

    generateQuiz: builder.mutation<
      Quiz,
      {
        documentId: string;
        body: GenerateQuizRequest;
      }
    >({
      query: ({ documentId, body }) => ({
        url: `/documents/${documentId}/quiz`,
        method: "POST",
        body,
      }),

      transformResponse: (
        response: QuizResponse
      ) => response.data,

      invalidatesTags: [
        "Quiz",
        "Document",
      ],
    }),
  }),
});

export const {
  useGetQuizQuery,
  useGenerateQuizMutation,
} = quizApi;