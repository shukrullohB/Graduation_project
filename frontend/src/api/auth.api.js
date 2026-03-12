import http from "./http";
import { DEMO_MODE, mockUser, mockTeacher } from "./mockData";

export const login = (credentials) => {
  if (DEMO_MODE) {
    const user = credentials.username === "teacher" ? mockTeacher : mockUser;
    return Promise.resolve({ data: { access_token: "demo-token", user } });
  }
  return http.post("/auth/login", credentials);
};

export const register = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { message: "ok" } });
  return http.post("/auth/register", data);
};

export const getMe = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockUser });
  return http.get("/auth/me");
};
