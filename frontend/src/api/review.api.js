import http from "./http";
import { DEMO_MODE, mockPendingAnswers } from "./mockData";

const toPercent = (score, maxScore) => {
  if (score == null) return null;
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return null;

  if (numeric >= 0 && numeric <= 1) return Math.round(numeric * 100);
  if (typeof maxScore === "number" && maxScore > 0 && numeric <= maxScore) {
    return Math.round((numeric / maxScore) * 100);
  }
  return Math.round(numeric);
};

export const getPendingAnswers = async () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockPendingAnswers });

  const [pendingRes, questionsRes] = await Promise.all([
    http.get("/reviews/pending"),
    http.get("/questions"),
  ]);

  const questionMap = Object.fromEntries(
    (questionsRes.data || []).map((q) => [q.id, q]),
  );

  return {
    data: (pendingRes.data || []).map((a) => ({
      ...a,
      question_max_score: questionMap[a.question_id]?.max_score ?? 10,
      question_title:
        questionMap[a.question_id]?.title ?? `Question #${a.question_id}`,
      question_description:
        questionMap[a.question_id]?.prompt ??
        questionMap[a.question_id]?.description ??
        "",
      ai_score_percent: toPercent(
        a.ai_score,
        questionMap[a.question_id]?.max_score ?? 10,
      ),
      teacher_score_percent: toPercent(
        a.teacher_score,
        questionMap[a.question_id]?.max_score ?? 10,
      ),
      student_username: a.student_username ?? `Student #${a.student_id}`,
      score: a.teacher_score,
      feedback: a.teacher_feedback,
    })),
  };
};

export const submitReview = (answerId, data) => {
  if (DEMO_MODE) return Promise.resolve({ data: { answerId, ...data } });
  return http.post(`/reviews/${answerId}`, {
    teacher_score: data.score,
    teacher_feedback: data.feedback,
  });
};

export const getReview = (answerId) => {
  if (DEMO_MODE) {
    const a = mockPendingAnswers.find((a) => a.id === Number(answerId));
    return Promise.resolve({ data: a });
  }
  return http.get(`/reviews/${answerId}`);
};
