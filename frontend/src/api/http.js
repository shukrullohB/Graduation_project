
import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const isDev = import.meta.env.DEV;

const normalizeBaseUrl = (apiUrl) => {
  if (isDev) return "/api/v1";
  if (!apiUrl) return "/api/v1";

  const withoutTrailingSlash = apiUrl.replace(/\/+$/, "");
  if (withoutTrailingSlash.endsWith("/api/v1")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api/v1`;
};

const http = axios.create({
  baseURL: normalizeBaseUrl(rawApiUrl),
  headers: { "Content-Type": "application/json" },
});

export const getApiErrorMessage = (error, fallback = "Request failed") => {
  if (!error?.response) {
    return "Backend serverga ulanib bo'lmadi. Backend ishga tushganini tekshiring.";
  }

  const detail = error.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return first.msg;
  }

  const message = error.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const statusText = error.response?.statusText;
  if (typeof statusText === "string" && statusText.trim()) {
    return statusText;
  }

  return fallback;
};

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default http;
