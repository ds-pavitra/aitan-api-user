import { API_BASE_URL } from "./constants";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  method?: Method;
  body?: any;
  useAuth?: boolean; // whether to include Authorization header
};

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return (API_BASE_URL || "") + path;
}

function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

async function request(path: string, options: RequestOptions = {}) {
  const { method = "GET", body, headers = {}, useAuth = true, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  let bodyToSend: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      bodyToSend = body;
      // don't set content-type, browser will set multipart boundary
    } else {
      finalHeaders["Content-Type"] = "application/json";
      bodyToSend = JSON.stringify(body);
    }
  }

  if (useAuth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: bodyToSend,
    ...rest,
  });

  // If unauthorized, return response as-is (higher-level code can trigger refresh logic)
  if (res.status === 401) {
    // TODO: implement refresh token flow if applicable
    // for now, just throw to let caller handle
    const errText = await res.text().catch(() => "");
    const error = new Error(errText || "Unauthorized");
    (error as any).status = 401;
    throw error;
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data?.message || res.statusText || "Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: any = new Error(text || res.statusText || "Request failed");
    err.status = res.status;
    throw err;
  }

  // fallback to text
  return res.text();
}

export const client = {
  request,
  get: (path: string, options?: RequestOptions) => request(path, { method: "GET", ...options }),
  post: (path: string, body?: any, options?: RequestOptions) => request(path, { method: "POST", body, ...options }),
  put: (path: string, body?: any, options?: RequestOptions) => request(path, { method: "PUT", body, ...options }),
  del: (path: string, options?: RequestOptions) => request(path, { method: "DELETE", ...options }),
};
