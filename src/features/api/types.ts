export type ContactMethod = "EMAIL" | "MOBILE";
export type Purpose = "SIGNUP" | "LOGIN" | "RESET" | string;

export interface SendOtpRequest {
  contactMethod: ContactMethod;
  contactValue: string;
  purpose: Purpose;
}

export interface VerifyOtpRequest extends SendOtpRequest {
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  businessType: string; // could be enum like 'PUBLIC' | 'PRIVATE' etc.
  businessName: string;
  registrationNo: string | null;
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user?: any;
}
