import http from "./http";

export const submitAnswer = (data) => http.post("/answers", data);
export const getMyAnswers = () => http.get("/answers/me");
export const getAnswer = (id) => http.get(`/answers/${id}`);
