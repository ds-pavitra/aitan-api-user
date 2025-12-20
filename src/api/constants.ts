export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.29.73:8080";

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  SEND_OTP: "/resend-otp",
  VERIFY_OTP: "/verify-otp",
  REGISTER: "/auth/register",
  REFRESH: "/api/auth/refresh",
};
