import http from "./http";
import { DEMO_MODE, mockPendingAnswers } from "./mockData";

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
      question_title:
        questionMap[a.question_id]?.title ?? `Question #${a.question_id}`,
      question_description:
        questionMap[a.question_id]?.prompt ??
        questionMap[a.question_id]?.description ??
        "",
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
