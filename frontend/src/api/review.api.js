import api from "./http";

export const fetchPendingReviews = async () => {
  const { data } = await api.get("/review/pending");
  return data;
};

export const submitReview = async (answerId, payload) => {
  const { data } = await api.post(`/review/${answerId}`, payload);
  return data;
};
