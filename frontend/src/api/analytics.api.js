import api from "./http";

export const fetchSummary = async () => {
  const { data } = await api.get("/analytics/summary");
  return data;
};

export const fetchDistribution = async () => {
  const { data } = await api.get("/analytics/distribution");
  return data;
};

export const fetchMistakes = async () => {
  const { data } = await api.get("/analytics/mistakes");
  return data;
};
