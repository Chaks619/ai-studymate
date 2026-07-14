import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/types/api/auth.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    /**
     * Replaces the user without touching the session — settings updates
     * return a fresh user object and shouldn't disturb the access token.
     */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    initialize(state) {
      state.isInitialized = true;
    }
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  initialize
} = authSlice.actions;

export default authSlice.reducer;