import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  token: string | null;
  user: any | null;
};

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user?: any }>) {
      state.token = action.payload.token;
      if (action.payload.user) state.user = action.payload.user;
      try {
        localStorage.setItem("token", action.payload.token);
      } catch {}
    },
    logout(state) {
      state.token = null;
      state.user = null;
      try {
        localStorage.removeItem("token");
      } catch {}
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
