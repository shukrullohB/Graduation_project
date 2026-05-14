import http from "./http";
import {
  DEMO_MODE,
  mockAnalyticsStudent,
  mockAnalyticsTeacher,
} from "./mockData";

const toPercent = (score, maxScoreHint = 5) => {
  if (score == null) return null;
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return null;

  if (numeric >= 0 && numeric <= 1) return Math.round(numeric * 100);
  if (maxScoreHint > 0 && numeric >= 0 && numeric <= maxScoreHint) {
    return Math.round((numeric / maxScoreHint) * 100);
  }
  return Math.round(numeric);
};

const avg = (arr) => {
  if (!arr.length) return 0;
  return Number((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2));
};

const mapScoresToDistribution = (scores) => {
  const buckets = { high: 0, mid: 0, low: 0 };
  for (const score of scores) {
    if (score >= 80) buckets.high += 1;
    else if (score >= 50) buckets.mid += 1;
    else buckets.low += 1;
  }
  return [
    { range: "80-100", count: buckets.high },
    { range: "50-79", count: buckets.mid },
    { range: "0-49", count: buckets.low },
  ];
};

export const getStudentAnalytics = async () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsStudent });

  const [answersRes, questionsRes] = await Promise.all([
    http.get("/answers/my"),
    http.get("/questions"),
  ]);
  const answers = answersRes.data || [];
  const questionMap = Object.fromEntries(
    (questionsRes.data || []).map((q) => [q.id, q]),
  );

  const toAnswerPercent = (answer, rawScore) =>
    toPercent(rawScore, questionMap[answer.question_id]?.max_score ?? 5);

  const teacherScores = answers
    .map((a) => toAnswerPercent(a, a.teacher_score))
    .filter((v) => typeof v === "number");
  const aiScores = answers
    .map((a) => toAnswerPercent(a, a.ai_score))
    .filter((v) => typeof v === "number");
  const finalScores = answers
    .map((a) => {
      const raw =
        typeof a.teacher_score === "number" ? a.teacher_score : a.ai_score;
      return toAnswerPercent(a, raw);
    })
    .filter((v) => typeof v === "number");

  return {
    data: {
      avgScores: [
        { subject: "Teacher Avg", avgScore: avg(teacherScores) },
        { subject: "AI Avg", avgScore: avg(aiScores) },
      ],
      mistakes: [
        {
          subject: "Pending Reviews",
          mistakes: answers.filter((a) => a.teacher_score == null).length,
        },
        {
          subject: "Low Scores",
          mistakes: finalScores.filter((s) => s < 50).length,
        },
      ],
      distribution: mapScoresToDistribution(finalScores),
    },
  };
};

export const getTeacherAnalytics = async () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsTeacher });

  const [res, questionsRes] = await Promise.all([
    http.get("/analytics/overview"),
    http.get("/questions"),
  ]);
  const d = res.data || {};
  const questionMaxScores = (questionsRes.data || [])
    .map((q) => Number(q.max_score))
    .filter((v) => Number.isFinite(v) && v > 0);
  const maxScoreHint = questionMaxScores.length
    ? avg(questionMaxScores)
    : 5;

  return {
    data: {
      avgScores: [
        {
          subject: "Teacher Avg",
          avgScore: toPercent(d.avg_teacher_score ?? 0, maxScoreHint) ?? 0,
        },
        {
          subject: "AI Avg",
          avgScore: toPercent(d.avg_ai_score ?? 0, maxScoreHint) ?? 0,
        },
      ],
      mistakes: [
        {
          subject: "Pending Reviews",
          mistakes: (d.total_answers ?? 0) - (d.total_reviewed_answers ?? 0),
        },
        {
          subject: "Reviewed",
          mistakes: d.total_reviewed_answers ?? 0,
        },
      ],
      distribution: [
        { range: "Reviewed", count: d.total_reviewed_answers ?? 0 },
        {
          range: "Pending",
          count: (d.total_answers ?? 0) - (d.total_reviewed_answers ?? 0),
        },
      ],
    },
  };
};
