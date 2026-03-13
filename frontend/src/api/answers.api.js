import http from "./http";
import { DEMO_MODE, mockAnswers } from "./mockData";

const normalizeAnswer = (answer, questionMap = {}) => ({
  ...answer,
  question_title:
    questionMap[answer.question_id] ?? `Question #${answer.question_id}`,
  score: answer.teacher_score,
  feedback: answer.teacher_feedback,
  student_username: answer.student_username ?? `Student #${answer.student_id}`,
});

export const submitAnswer = (data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { ...data, id: Date.now() } });
  return http.post("/answers/submit", data);
};

export const getMyAnswers = async () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnswers });

  const [answersRes, questionsRes] = await Promise.all([
    http.get("/answers/my"),
    http.get("/questions"),
  ]);

  const questionMap = Object.fromEntries(
    (questionsRes.data || []).map((q) => [q.id, q.title]),
  );

  return {
    data: (answersRes.data || []).map((a) => normalizeAnswer(a, questionMap)),
  };
};

export const getAnswer = async (id) => {
  if (DEMO_MODE) {
    const a = mockAnswers.find((a) => a.id === Number(id));
    return Promise.resolve({ data: a });
  }

  const [pendingRes, questionsRes] = await Promise.all([
    http.get("/reviews/pending"),
    http.get("/questions"),
  ]);

  const questionMap = Object.fromEntries(
    (questionsRes.data || []).map((q) => [q.id, q.title]),
  );

  const match = (pendingRes.data || []).find((a) => a.id === Number(id));
  if (!match) {
    throw new Error("Answer not found in pending review list");
  }

  return { data: normalizeAnswer(match, questionMap) };
};
