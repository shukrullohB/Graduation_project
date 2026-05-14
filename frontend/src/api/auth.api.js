import http from "./http";
import { DEMO_MODE, mockUser, mockTeacher } from "./mockData";

const normalizeUser = (raw) => ({
  ...raw,
  username: raw?.username ?? raw?.full_name ?? raw?.email ?? "user",
});

export const login = async (credentials) => {
  if (DEMO_MODE) {
    const user =
      (credentials.email || "").toLowerCase() === "teacher" ||
      (credentials.email || "").toLowerCase() === "teacher@demo.com"
        ? mockTeacher
        : mockUser;
    return Promise.resolve({ data: { access_token: "demo-token", user } });
  }

  const loginRes = await http.post("/auth/login/json", {
    email: credentials.email,
    password: credentials.password,
  });
  const token = loginRes.data.access_token;
  localStorage.setItem("token", token);
  const meRes = await http.get("/auth/me");
  return {
    data: {
      access_token: token,
      user: normalizeUser(meRes.data),
    },
  };
};

export const register = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { message: "ok" } });
  return http.post("/auth/register", {
    full_name: data.full_name,
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

export const getMe = () => {
  if (DEMO_MODE) return Promise.resolve({ data: normalizeUser(mockUser) });
  return http.get("/auth/me").then((res) => ({
    ...res,
    data: normalizeUser(res.data),
  }));
};
