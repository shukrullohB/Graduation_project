import http from "./http";
import { DEMO_MODE, mockAnswers } from "./mockData";

const toPercent = (score, maxScore) => {
  if (score == null) return null;
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return null;

  // NLP scores are usually normalized in [0..1]
  if (numeric >= 0 && numeric <= 1) {
    return Math.round(numeric * 100);
  }

  // Teacher score is usually in [0..maxScore]
  if (typeof maxScore === "number" && maxScore > 0 && numeric <= maxScore) {
    return Math.round((numeric / maxScore) * 100);
  }

  return Math.round(numeric);
};

const normalizeAnswer = (answer, questionMap = {}) => {
  const question = questionMap[answer.question_id];
  const maxScore = question?.max_score;

  return {
    ...answer,
    question_title: question?.title ?? `Question #${answer.question_id}`,
    question_max_score: maxScore ?? null,
    score: toPercent(answer.teacher_score, maxScore),
    ai_score: toPercent(answer.ai_score, maxScore),
    teacher_feedback: answer.teacher_feedback,
    ai_feedback: answer.ai_feedback,
    feedback: answer.teacher_feedback || answer.ai_feedback || null,
    student_username: answer.student_username ?? `Student #${answer.student_id}`,
  };
};

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
    (questionsRes.data || []).map((q) => [q.id, q]),
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
    (questionsRes.data || []).map((q) => [q.id, q]),
  );

  const match = (pendingRes.data || []).find((a) => a.id === Number(id));
  if (!match) {
    throw new Error("Answer not found in pending review list");
  }

  return { data: normalizeAnswer(match, questionMap) };
};
