import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getStudentAnalytics, getTeacherAnalytics } from "../api/analytics.api";
import AverageScore from "../components/charts/AverageScore";
import Mistakes from "../components/charts/Mistakes";
import ScoreDistribution from "../components/charts/ScoreDistribution";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role === "teacher";

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", user?.role],
    queryFn: () =>
      isTeacher
        ? getTeacherAnalytics().then((r) => r.data)
        : getStudentAnalytics().then((r) => r.data),
  });

  if (isLoading) return <p>Loading analytics...</p>;

  const avgTeacher =
    analytics?.avgScores?.find((item) => item.subject === "Teacher Avg")
      ?.avgScore ?? 0;
  const avgAi =
    analytics?.avgScores?.find((item) => item.subject === "AI Avg")?.avgScore ??
    0;
  const delta = Number((avgTeacher - avgAi).toFixed(1));

  const distribution = analytics?.distribution ?? [];
  const distributionTotal = distribution.reduce(
    (sum, item) => sum + (item.count ?? 0),
    0,
  );
  const dominantBand = distribution.reduce(
    (best, current) => ((current.count ?? 0) > (best.count ?? 0) ? current : best),
    { range: "-", count: 0 },
  );
  const overview = analytics?.overview ?? {};
  const questionLoad = analytics?.questionLoad ?? [];
  const coverage = Math.round(Number(overview.review_coverage_percent ?? 0));

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h2>{isTeacher ? "Teacher" : "Student"} Analytics</h2>
          <p className="page-subtitle">Performance overview and insights</p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate(isTeacher ? "/teacher" : "/student")}
        >
          ← Back
        </button>
      </div>

      <div className="analytics-kpi-grid">
        <article className="analytics-kpi-card">
          <span>Teacher Avg</span>
          <strong>{Math.round(avgTeacher)}%</strong>
        </article>
        <article className="analytics-kpi-card">
          <span>AI Avg</span>
          <strong>{Math.round(avgAi)}%</strong>
        </article>
        <article className="analytics-kpi-card">
          <span>Teacher vs AI Gap</span>
          <strong>{delta >= 0 ? `+${delta}` : delta}%</strong>
        </article>
        <article className="analytics-kpi-card">
          <span>Largest Segment</span>
          <strong>{dominantBand.range}</strong>
          <small>{dominantBand.count} items</small>
        </article>
        {isTeacher ? (
          <article className="analytics-kpi-card">
            <span>Review Coverage</span>
            <strong>{coverage}%</strong>
            <small>
              {overview.reviewed_answers ?? 0}/{overview.total_answers ?? 0} reviewed
            </small>
          </article>
        ) : null}
      </div>

      <div className="charts-grid">
        <div className="chart-section">
          <h3>Average Score by Subject</h3>
          <AverageScore data={analytics?.avgScores ?? []} />
        </div>
        <div className="chart-section">
          <h3>Common Mistakes</h3>
          <Mistakes data={analytics?.mistakes ?? []} />
        </div>
        <div className="chart-section">
          <h3>Score Distribution</h3>
          <ScoreDistribution data={analytics?.distribution ?? []} />
        </div>
        {isTeacher ? (
          <div className="chart-section chart-section--wide">
            <h3>Question Workload (Reviewed vs Pending)</h3>
            {questionLoad.length === 0 ? (
              <p className="text-muted">No question-level activity yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={questionLoad}
                  margin={{ top: 10, right: 10, left: -14, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6eeff" />
                  <XAxis
                    dataKey="subject"
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                    height={52}
                    tick={{ fontSize: 11, fill: "#60708f" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#60708f" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reviewed" name="Reviewed" stackId="a" fill="#16a34a" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : null}
      </div>

      <section className="analytics-insights card">
        <h3 className="card-title">Actionable Insights</h3>
        <ul className="analytics-insight-list">
          <li>
            Total tracked records: <strong>{distributionTotal}</strong>
          </li>
          <li>
            Dominant performance band: <strong>{dominantBand.range}</strong>
          </li>
          <li>
            {delta > 10
              ? "Teacher grading is notably stricter than AI. Consider calibrating rubric prompts."
              : delta < -10
                ? "AI appears stricter than teacher grading. Review AI rubric alignment."
                : "Teacher and AI grading are reasonably aligned."}
          </li>
        </ul>
      </section>
    </div>
  );
}
