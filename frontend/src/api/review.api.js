import http from "./http";
import { DEMO_MODE, mockPendingAnswers } from "./mockData";

export const getPendingAnswers = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockPendingAnswers });
  return http.get("/reviews/pending");
};

export const submitReview = (answerId, data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { answerId, ...data } });
  return http.post(`/reviews/${answerId}`, data);
};

export const getReview = (answerId) => {
  if (DEMO_MODE) {
    const a = mockPendingAnswers.find((a) => a.id === Number(answerId));
    return Promise.resolve({ data: a });
  }
  return http.get(`/reviews/${answerId}`);
};
