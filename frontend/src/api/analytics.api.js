import http from "./http";
import {
  DEMO_MODE,
  mockAnalyticsStudent,
  mockAnalyticsTeacher,
} from "./mockData";

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

  const answersRes = await http.get("/answers/my");
  const answers = answersRes.data || [];

  const teacherScores = answers
    .map((a) => a.teacher_score)
    .filter((v) => typeof v === "number");
  const aiScores = answers
    .map((a) => a.ai_score)
    .filter((v) => typeof v === "number");
  const finalScores = answers
    .map((a) =>
      typeof a.teacher_score === "number" ? a.teacher_score : a.ai_score,
    )
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

  const res = await http.get("/analytics/overview");
  const d = res.data || {};
  return {
    data: {
      avgScores: [
        { subject: "Teacher Avg", avgScore: d.avg_teacher_score ?? 0 },
        { subject: "AI Avg", avgScore: d.avg_ai_score ?? 0 },
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
