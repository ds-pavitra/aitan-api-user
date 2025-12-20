import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, ENDPOINTS } from "../../api/constants";
import type { RootState } from "../../store";
import type { SendOtpRequest, VerifyOtpRequest, LoginRequest, RegisterRequest, AuthResponse, OtpResponse } from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL || "",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: ENDPOINTS.LOGIN, method: "POST", body }),
    }),
    sendOtp: builder.mutation<OtpResponse, SendOtpRequest>({
      query: (body) => ({ url: ENDPOINTS.SEND_OTP, method: "POST", body }),
    }),
    verifyOtp: builder.mutation<OtpResponse, VerifyOtpRequest>({
      query: (body) => ({ url: ENDPOINTS.VERIFY_OTP, method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: ENDPOINTS.REGISTER, method: "POST", body }),
    }),
    // add more endpoints as needed
  }),
});

export const { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation, useRegisterMutation } = api;
