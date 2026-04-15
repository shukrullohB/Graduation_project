import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTeacherAnalytics } from "../api/analytics.api";
import { getPendingAnswers } from "../api/review.api";

export default function TeacherProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: analytics } = useQuery({
    queryKey: ["teacherAnalyticsOverview"],
    queryFn: () => getTeacherAnalytics().then((r) => r.data),
  });

  const { data: pending = [] } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
  });

  const reviewedCount =
    analytics?.distribution?.find((d) => d.range === "Reviewed")?.count ?? 0;
  const totalCount = pending.length + reviewedCount;
  const avgAi =
    analytics?.avgScores?.find((i) => i.subject === "AI Avg")?.avgScore ?? 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page teacher-profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Profile</h1>
          <p className="page-subtitle">Account information and quick access.</p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate("/teacher")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="teacher-profile-card">
        <div className="teacher-profile-avatar">
          {(user?.username ?? "TE").slice(0, 2).toUpperCase()}
        </div>
        <div className="teacher-profile-info">
          <h2>{user?.username ?? "Teacher User"}</h2>
          <p>{user?.email ?? "No email"}</p>
          <span className="badge badge--reviewed">{user?.role ?? "teacher"}</span>
        </div>
      </div>

      <div className="teacher-profile-metrics">
        <article className="teacher-profile-metric-card">
          <span>Pending</span>
          <strong>{pending.length}</strong>
          <small>Answers waiting for review</small>
        </article>
        <article className="teacher-profile-metric-card">
          <span>Reviewed</span>
          <strong>{reviewedCount}</strong>
          <small>Completed evaluations</small>
        </article>
        <article className="teacher-profile-metric-card">
          <span>Total Handled</span>
          <strong>{totalCount}</strong>
          <small>Queue + reviewed workload</small>
        </article>
        <article className="teacher-profile-metric-card">
          <span>AI Average</span>
          <strong>{Math.round(avgAi)}%</strong>
          <small>Current suggestion baseline</small>
        </article>
      </div>

      <section className="teacher-profile-panel">
        <h3>Workspace Preferences</h3>
        <ul>
          <li>Use Review Queue for fast keyboard-based grading workflow.</li>
          <li>Use Create Question AI assistant for draft generation and rubric hints.</li>
          <li>Check Analytics weekly to monitor pending/reviewed balance and AI alignment.</li>
        </ul>
      </section>

      <div className="teacher-profile-actions">
        <button type="button" className="btn" onClick={() => navigate("/teacher/review-queue")}>
          Open Review Queue
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/teacher/create-question")}>
          Question Studio
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/teacher/analytics")}>
          Insights Center
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

