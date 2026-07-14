import { setUser } from "@/features/auth/auth.slice";
import type { RootState } from "@/app/store";
import type { User } from "@/types/api/auth.types";
import type {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdatePreferencesRequest,
  UpdateProfileRequest,
} from "@/types/api/user.types";

import { baseApi } from "./baseApi";

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePreferences: builder.mutation<User, UpdatePreferencesRequest>({
      query: (body) => ({
        url: "/users/me/preferences",
        method: "PATCH",
        body,
      }),

      transformResponse: (response: UserResponse) => response.data,

      // Applied to the store before the request resolves: theme and accent
      // are rendered straight off `auth.user`, so waiting for the round trip
      // would make every appearance change feel laggy.
      async onQueryStarted(patch, { dispatch, getState, queryFulfilled }) {
        const previous = (getState() as RootState).auth.user;

        if (!previous) return;

        dispatch(
          setUser({
            ...previous,
            preferences: {
              ...previous.preferences,
              ...patch,
              autoGenerate: {
                ...previous.preferences.autoGenerate,
                ...patch.autoGenerate,
              },
            },
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data));
        } catch {
          dispatch(setUser(previous));
        }
      },
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),

      transformResponse: (response: UserResponse) => response.data,

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(setUser(data));
      },
    }),

    updateAvatar: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: "/users/me/avatar",
        method: "PATCH",
        body: formData,
      }),

      transformResponse: (response: UserResponse) => response.data,

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(setUser(data));
      },
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/users/me/password",
        method: "POST",
        body,
      }),
    }),

    deleteAccount: builder.mutation<void, DeleteAccountRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useUpdatePreferencesMutation,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
