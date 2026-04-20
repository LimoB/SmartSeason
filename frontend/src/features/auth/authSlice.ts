import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/types";

/* ================= STATE ================= */

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // ================= SET LOGIN =================
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },

  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;