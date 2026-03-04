import api from "./http";

export const fetchQuestions = async () => {
  const { data } = await api.get("/questions");
  return data;
};

export const fetchQuestionById = async (id) => {
  const { data } = await api.get(`/questions/${id}`);
  return data;
};
