// src/redux/services/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "../slices/authSlice";

const AUTH = `${import.meta.env.VITE_AUTH_API_BASE_URL}/auth-app`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login-check",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            dispatch(setCredentials(data.token));
            localStorage.setItem("token", data.token);
          }
        } catch {}
      },
    }),
    signup: builder.mutation({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: `/resend-otp?email=${encodeURIComponent(email)}`,
        method: "POST",
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: `/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`,
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(clearCredentials());
        localStorage.removeItem("token");
      },
    }),
    googleLogin: builder.mutation({
      query: (payload) => ({
        url: "/google-login",
        method: "POST",
        body: payload,
      }),
    }),
    checkUser: builder.query({
      query: (email) => ({
        url: `/check-user?email=${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useCheckUserQuery,
  useLazyCheckUserQuery,  
} = authApi;
