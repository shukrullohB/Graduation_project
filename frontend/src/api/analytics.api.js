import http from "./http";
import {
    DEMO_MODE,
    mockAnalyticsStudent,
    mockAnalyticsTeacher,
} from "./mockData";

const toPercent = (score, maxScore = 100) => {
    if (score == null) return null;
    const numeric = Number(score);
    if (!Number.isFinite(numeric)) return null;
    if (numeric >= 0 && numeric <= 1) return Math.round(numeric * 100);
    if (maxScore > 0 && numeric <= maxScore) {
        return Math.round((numeric / maxScore) * 100);
    }
    return Math.round(numeric);
};

const getQuestionMaxScore = (questionMap, questionId, fallback = 10) => {
    const question = questionMap[questionId];
    if (question && typeof question.max_score === "number") {
        return question.max_score;
    }
    return fallback;
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

export const getStudentAnalytics = async() => {
    if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsStudent });

    const [answersRes, questionsRes] = await Promise.all([
        http.get("/answers/my"),
        http.get("/questions"),
    ]);
    const answers = answersRes.data || [];
    const questionMap = Object.fromEntries((questionsRes.data || []).map((q) => [q.id, q]));

    const teacherScores = answers
        .map((a) => toPercent(a.teacher_score, getQuestionMaxScore(questionMap, a.question_id)))
        .filter((v) => typeof v === "number");
    const aiScores = answers
        .map((a) => toPercent(a.ai_score, getQuestionMaxScore(questionMap, a.question_id)))
        .filter((v) => typeof v === "number");
    const finalScores = answers
        .map((a) => {
            const raw = typeof a.teacher_score === "number" ? a.teacher_score : a.ai_score;
            return toPercent(raw, getQuestionMaxScore(questionMap, a.question_id));
        })
        .filter((v) => typeof v === "number");

    return {
        data: {
            avgScores: [
                { subject: "Teacher Avg", avgScore: avg(teacherScores) },
                { subject: "AI Avg", avgScore: avg(aiScores) },
            ],
            mistakes: [{
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

export const getTeacherAnalytics = async() => {
    if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsTeacher });

    const [overviewRes, questionsRes] = await Promise.all([
        http.get("/analytics/overview"),
        http.get("/questions"),
    ]);
    const d = overviewRes.data || {};
    const questions = questionsRes.data || [];

    const questionStats = await Promise.all(
        questions.map((q) =>
            http
            .get(`/analytics/questions/${q.id}`)
            .then((r) => ({ question: q, stats: r.data }))
            .catch(() => ({ question: q, stats: null })),
        ),
    );

    const questionLoad = questionStats
        .map(({ question, stats }) => {
            const total = Number(stats && stats.total_answers != null ? stats.total_answers : 0);
            const reviewed = Number(
                stats && stats.reviewed_answers != null ? stats.reviewed_answers : 0,
            );
            const pending = Math.max(total - reviewed, 0);
            const subject = question && question.title ? question.title : `Q${question ? question.id : "-"}`;
            return {
                subject,
                reviewed,
                pending,
                total,
            };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

    const highLoadQuestion = questionLoad[0];
    const teacherAvg = toPercent(d.avg_teacher_score, 1);
    const aiAvg = toPercent(d.avg_ai_score, 1);

    const totalAnswers = Number(d.total_answers || 0);
    const reviewedAnswers = Number(d.total_reviewed_answers || 0);

    return {
        data: {
            avgScores: [
                { subject: "Teacher Avg", avgScore: teacherAvg != null ? teacherAvg : 0 },
                { subject: "AI Avg", avgScore: aiAvg != null ? aiAvg : 0 },
            ],
            mistakes: [{
                    subject: "Pending Reviews",
                    mistakes: totalAnswers - reviewedAnswers,
                },
                {
                    subject: "Reviewed",
                    mistakes: reviewedAnswers,
                },
            ],
            distribution: [
                { range: "Reviewed", count: reviewedAnswers },
                {
                    range: "Pending",
                    count: totalAnswers - reviewedAnswers,
                },
                {
                    range: "Coverage Gap",
                    count: Math.max(100 - Number(d.review_coverage_percent || 0), 0),
                },
            ],
            questionLoad,
            overview: {
                total_questions: Number(d.total_questions || 0),
                total_answers: totalAnswers,
                reviewed_answers: reviewedAnswers,
                review_coverage_percent: Number(d.review_coverage_percent || 0),
                high_load_question: highLoadQuestion ? highLoadQuestion.subject : "-",
            },
        },
    };
};