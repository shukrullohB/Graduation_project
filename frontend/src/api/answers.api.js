import api from "./http";

export const submitAnswer = async (payload) => {
  const { data } = await api.post("/answers", payload);
  return data;
};
