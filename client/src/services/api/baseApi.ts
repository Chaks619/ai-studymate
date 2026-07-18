import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { logout, setCredentials } from "@/features/auth/auth.slice";
import type { AuthResponse } from "@/types/api/auth.types";
import { RootState } from "@/app/store";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:5000/api",

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(
    args,
    api,
    extraOptions
  );

  if (result.error?.status === 401 && (typeof args === "string" ? args !== "/auth/refresh" : args.url !== "/auth/refresh")) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const response =
        refreshResult.data as AuthResponse;

      api.dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        })
      );

      result = await baseQuery(
        args,
        api,
        extraOptions
      );
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Workspace",
    "Document",
    "Summary",
    "Flashcard",
    "Quiz",
    "Conversation"
  ],

  endpoints: () => ({}),
});