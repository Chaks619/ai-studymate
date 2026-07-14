import { baseApi } from "./baseApi";

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/api/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    me: builder.query<AuthResponse["data"]["user"], void>({
      query: () => ({
        url: "/auth/me",
      }),

      transformResponse: (response: AuthResponse) => response.data.user,

      providesTags: ["User"],
    }),

    refresh: builder.mutation<AuthResponse, void>({
        query: () => ({
            url: "/auth/refresh",
            method: "POST",
        }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation
} = authApi;