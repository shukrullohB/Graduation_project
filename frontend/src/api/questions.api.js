import http from "./http";

export const getQuestions = () => http.get("/questions");
export const getQuestion = (id) => http.get(`/questions/${id}`);
export const createQuestion = (data) => http.post("/questions", data);
