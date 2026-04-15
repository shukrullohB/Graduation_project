import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getTeacherAnalytics } from "../api/analytics.api";
import { getPendingAnswers } from "../api/review.api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const { data: pending, isLoading, refetch } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
  const { data: analytics } = useQuery({
    queryKey: ["teacherAnalyticsOverview"],
    queryFn: () => getTeacherAnalytics().then((r) => r.data),
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const queue = pending ?? [];
  const pendingCount = queue.length;
  const reviewedCount = analytics?.distribution?.find(
    (d) => d.range === "Reviewed",
  )?.count;
  const totalAnswers =
    pendingCount + (Number.isFinite(reviewedCount) ? reviewedCount : 0);

  const highPriorityCount = queue.filter(
    (a) => typeof a.ai_score_percent === "number" && a.ai_score_percent < 60,
  ).length;

  const avgAiSuggestion = pendingCount
    ? Math.round(
        queue.reduce((sum, item) => sum + (item.ai_score_percent ?? 0), 0) /
          pendingCount,
      )
    : 0;

  const nextReview = queue[0];

  if (isLoading) return <LoadingSpinner text="Loading teacher workspace..." />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "TE";

  return (
    <div className={`dashboard teacher-dashboard teacher-shell ${isDark ? "teacher-dashboard--dark" : ""}`}>
      <aside className="teacher-left-rail">
        <div className="teacher-left-brand">
          <div className="teacher-left-brand-mark">✦</div>
          <div>
            <strong>TeacherHub</strong>
            <span>ASAG workspace</span>
          </div>
        </div>

        <nav className="teacher-left-nav">
          <NavLink to="/teacher" end className="teacher-left-nav-item">
            <span className="teacher-left-nav-dot" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/teacher/review-queue" className="teacher-left-nav-item">
            <span className="teacher-left-nav-dot" />
            <span>Review Queue</span>
          </NavLink>
          <NavLink to="/teacher/create-question" className="teacher-left-nav-item">
            <span className="teacher-left-nav-dot" />
            <span>Create Question</span>
          </NavLink>
          <NavLink to="/teacher/analytics" className="teacher-left-nav-item">
            <span className="teacher-left-nav-dot" />
            <span>Analytics</span>
          </NavLink>
          {nextReview ? (
            <Link
              to={`/teacher/review/${nextReview.id}`}
              className="teacher-left-nav-item"
            >
              <span className="teacher-left-nav-dot" />
              <span>Next Review</span>
            </Link>
          ) : (
            <NavLink to="/teacher/review-queue" className="teacher-left-nav-item is-muted">
              <span className="teacher-left-nav-dot" />
              <span>No Pending Review</span>
            </NavLink>
          )}
        </nav>

        <button type="button" className="teacher-left-signout" onClick={handleLogout}>
          Sign Out
        </button>
      </aside>

      <div className="teacher-main-area">
        <div className="teacher-top-utils">
          <div className="teacher-top-utils-left">
            <button
              type="button"
              className={`teacher-theme-toggle ${isDark ? "is-dark" : ""}`}
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="teacher-theme-toggle-track" aria-hidden="true">
                <span className="teacher-theme-toggle-knob" />
              </span>
              <span className="teacher-theme-toggle-label">
                {isDark ? "Night" : "Light"}
              </span>
            </button>
          </div>
          <div className="teacher-top-utils-right">
            <Link
              to="/teacher/profile"
              className="teacher-profile-link"
              aria-label="Open profile"
              title="Open profile"
            >
              <span className="teacher-util-avatar">{initials}</span>
              <span className="teacher-profile-meta">
                <strong>{user?.username ?? "Teacher"}</strong>
                <small>Profile</small>
              </span>
            </Link>
          </div>
        </div>

        <section className="teacher-hero">
          <div className="teacher-hero-content">
            <span className="teacher-hero-kicker">Teacher workspace</span>
            <h1 className="teacher-hero-title">Teacher Dashboard</h1>
            <p className="teacher-hero-text">
              Everything important in one place: queue, analytics, and question
              authoring. Use the actions below for a clean grading workflow.
            </p>
            <div className="teacher-hero-meta">
              <span className="badge badge--pending">{pendingCount} pending</span>
              <span className="badge badge--reviewed">
                {Number.isFinite(reviewedCount) ? reviewedCount : 0} reviewed
              </span>
              <span className="badge badge--done">{totalAnswers} total</span>
            </div>
          </div>
        </section>

        <section className="teacher-summary-grid">
          <article className="teacher-summary-card">
            <h3>Pending Reviews</h3>
            <p>{pendingCount} answers waiting in queue</p>
          </article>
          <article className="teacher-summary-card">
            <h3>High Priority</h3>
            <p>{highPriorityCount} answers with AI &lt; 60%</p>
          </article>
          <article className="teacher-summary-card">
            <h3>AI Queue Average</h3>
            <p>{avgAiSuggestion}% suggested score</p>
          </article>
          <article className="teacher-summary-card">
            <h3>Reviewed</h3>
            <p>{Number.isFinite(reviewedCount) ? reviewedCount : 0} completed</p>
          </article>
        </section>

        <section className="teacher-primary-actions">
          <Link to="/teacher/review-queue" className="btn teacher-action-btn teacher-action-btn--primary">
            Queue Workspace
          </Link>
          {nextReview ? (
            <Link
              to={`/teacher/review/${nextReview.id}`}
              className="btn btn--secondary teacher-action-btn teacher-action-btn--emphasis"
            >
              Next Submission
            </Link>
          ) : null}
          <Link to="/teacher/create-question" className="btn btn--secondary teacher-action-btn">
            Question Studio
          </Link>
          <Link to="/teacher/analytics" className="btn btn--secondary teacher-action-btn">
            Insights Center
          </Link>
          <button type="button" className="btn btn--secondary teacher-action-btn" onClick={() => refetch()}>
            Sync Queue
          </button>
        </section>

        <section className="teacher-panel teacher-panel--workflow">
          <div className="teacher-panel-head">
            <h2>Recommended Workflow</h2>
          </div>
          <div className="teacher-workflow-grid">
            <article className="teacher-workflow-card">
              <strong>1) Start with queue</strong>
              <p>Review all pending answers from one dedicated page.</p>
              <Link to="/teacher/review-queue" className="btn btn--secondary">
                Go to Queue
              </Link>
            </article>
            <article className="teacher-workflow-card">
              <strong>2) Create better questions</strong>
              <p>Use AI draft and refine rubric-aligned reference answers.</p>
              <Link to="/teacher/create-question" className="btn btn--secondary">
                Create Question
              </Link>
            </article>
            <article className="teacher-workflow-card">
              <strong>3) Monitor outcomes</strong>
              <p>Track reviewed vs pending and identify weak topics quickly.</p>
              <Link to="/teacher/analytics" className="btn btn--secondary">
                Open Analytics
              </Link>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
