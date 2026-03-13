import http from "./http";
import { DEMO_MODE, mockQuestions } from "./mockData";

const normalizeQuestion = (q) => ({
  ...q,
  description: q.description ?? q.prompt,
});

export const getQuestions = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockQuestions });
  return http
    .get("/questions")
    .then((res) => ({ ...res, data: (res.data || []).map(normalizeQuestion) }));
};

export const getQuestion = (id) => {
  if (DEMO_MODE) {
    const q = mockQuestions.find((q) => q.id === Number(id));
    return Promise.resolve({ data: q });
  }
  return http
    .get(`/questions/${id}`)
    .then((res) => ({ ...res, data: normalizeQuestion(res.data) }));
};

export const createQuestion = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { ...data, id: Date.now() } });
  return http.post("/questions", {
    title: data.title,
    prompt: data.description,
    reference_answer: data.reference_answer,
    max_score: data.max_score,
  });
};
