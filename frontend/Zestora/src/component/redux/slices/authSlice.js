// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let initialUser = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    initialUser = { email: decoded.sub, role: decoded.role };
  } catch (e) {
    console.error("Invalid token", e);
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: initialUser,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;

      if (user) {
        // use the provided user (from backend)
        state.user = user;
      } else {
        // fallback: decode manually if no user object was passed
        try {
          const decoded = jwtDecode(token);
          state.user = { email: decoded.sub, role: decoded.role };
        } catch (e) {
          console.error("Error decoding token", e);
          state.user = null;
        }
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
