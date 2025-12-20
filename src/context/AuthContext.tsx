import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "../api/client";
import { ENDPOINTS } from "../api/constants";

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (payload: { email: string; password: string; otp?: string }) => Promise<any>;
  logout: () => void;
  setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    } catch {
      // ignore
    }
  }, [token]);

  const setToken = (t: string | null) => {
    setTokenState(t);
  };

  const login = async ({ email, password, otp }: { email: string; password: string; otp?: string }) => {
    // call API
    const payload: any = { email, password };
    if (otp) payload.otp = otp;

    const res = await client.post(ENDPOINTS.LOGIN, payload, { useAuth: false });

    // server may return { token, user } or set cookie; handle token first
    if (res && res.token) {
      setToken(res.token);
      if (res.user) setUser(res.user);
    }

    return res;
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    try {
      localStorage.removeItem("token");
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
