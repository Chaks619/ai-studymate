import { baseApi } from "./baseApi";

import type {
  Conversation,
  ConversationSummary,
  CreateConversationDto,
  SendMessageDto,
  SentMessage,
} from "@/types/api/conversation.types";

interface ConversationListResponse {
  success: boolean;
  message: string;
  data: ConversationSummary[];
}

/**
 * The detail endpoints send the summary and messages as two sibling fields;
 * transformResponse flattens them into a single Conversation.
 */
interface ConversationDetailResponse {
  success: boolean;
  message: string;
  data: {
    conversation: ConversationSummary;
    messages: Conversation["messages"];
  };
}

interface SentMessageResponse {
  success: boolean;
  message: string;
  data: SentMessage;
}

const flattenConversation = (
  response: ConversationDetailResponse
): Conversation => ({
  ...response.data.conversation,
  messages: response.data.messages,
});

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentConversations: builder.query<
      ConversationSummary[],
      string
    >({
      query: (documentId) =>
        `/documents/${documentId}/conversations`,

      transformResponse: (
        response: ConversationListResponse
      ) => response.data,

      providesTags: ["Conversation"],
    }),

    createConversation: builder.mutation<
      Conversation,
      {
        documentId: string;
        body: CreateConversationDto;
      }
    >({
      query: ({ documentId, body }) => ({
        url: `/documents/${documentId}/conversations`,
        method: "POST",
        body,
      }),

      transformResponse: flattenConversation,

      invalidatesTags: ["Conversation"],
    }),

    getConversation: builder.query<
      Conversation,
      string
    >({
      query: (conversationId) =>
        `/conversations/${conversationId}`,

      transformResponse: flattenConversation,

      providesTags: ["Conversation"],
    }),

    sendMessage: builder.mutation<
      SentMessage,
      {
        conversationId: string;
        body: SendMessageDto;
      }
    >({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),

      transformResponse: (
        response: SentMessageResponse
      ) => response.data,

      invalidatesTags: ["Conversation"],
    }),

    regenerateMessage: builder.mutation<SentMessage, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/regenerate`,
        method: "POST",
      }),

      transformResponse: (
        response: SentMessageResponse
      ) => response.data,

      invalidatesTags: ["Conversation"],
    }),

    deleteConversation: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const {
  useGetDocumentConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useSendMessageMutation,
  useRegenerateMessageMutation,
  useDeleteConversationMutation,
} = conversationApi;
