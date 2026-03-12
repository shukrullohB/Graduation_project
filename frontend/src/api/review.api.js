import http from "./http";

export const getPendingAnswers = () => http.get("/reviews/pending");
export const submitReview = (answerId, data) =>
  http.post(`/reviews/${answerId}`, data);
export const getReview = (answerId) => http.get(`/reviews/${answerId}`);
