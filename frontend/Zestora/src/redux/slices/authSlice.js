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
    user: initialUser || null, // empty until decoded
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      state.token = token;

      try {
        const decoded = jwtDecode(token);
        state.user = { email: decoded.sub, role: decoded.role };
      } catch (e) {
        console.error("Decode failed:", e);
        state.user = null;
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
