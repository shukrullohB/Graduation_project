import http from "./http";

export const login = (credentials) => http.post("/auth/login", credentials);
export const register = (data) => http.post("/auth/register", data);
export const getMe = () => http.get("/auth/me");
