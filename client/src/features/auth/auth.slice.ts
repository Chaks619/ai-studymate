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
  logout,
  initialize
} = authSlice.actions;

export default authSlice.reducer;