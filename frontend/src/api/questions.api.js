import http from "./http";
import { DEMO_MODE, mockQuestions } from "./mockData";

export const getQuestions = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockQuestions });
  return http.get("/questions");
};

export const getQuestion = (id) => {
  if (DEMO_MODE) {
    const q = mockQuestions.find((q) => q.id === Number(id));
    return Promise.resolve({ data: q });
  }
  return http.get(`/questions/${id}`);
};

export const createQuestion = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { ...data, id: Date.now() } });
  return http.post("/questions", data);
};
