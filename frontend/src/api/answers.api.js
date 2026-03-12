import http from "./http";
import { DEMO_MODE, mockAnswers } from "./mockData";

export const submitAnswer = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { ...data, id: Date.now() } });
  return http.post("/answers", data);
};

export const getMyAnswers = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnswers });
  return http.get("/answers/me");
};

export const getAnswer = (id) => {
  if (DEMO_MODE) {
    const a = mockAnswers.find((a) => a.id === Number(id));
    return Promise.resolve({ data: a });
  }
  return http.get(`/answers/${id}`);
};
