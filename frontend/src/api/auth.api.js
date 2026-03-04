import api from "./http";

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};
