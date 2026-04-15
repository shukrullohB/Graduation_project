import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getTeacherAnalytics } from "../api/analytics.api";
import { getPendingAnswers } from "../api/review.api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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

  const filteredQueue = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter((item) => {
      const haystack = [
        item.question_title,
        item.question_description,
        item.student_username,
        item.answer_text,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [queue, query]);

  const nextFilteredReview = filteredQueue[0];

  if (isLoading) return <LoadingSpinner text="Loading teacher workspace..." />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "TE";

  return (
    <div className={`dashboard teacher-dashboard teacher-shell ${isDark ? "teacher-shell--dark" : ""}`}>
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
          {nextFilteredReview ? (
            <Link
              to={`/teacher/review/${nextFilteredReview.id}`}
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
              <span>☀</span>
              <span>🌙</span>
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
              Track pending submissions, review faster, and keep grading quality
              consistent across your class.
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

        <section className="teacher-primary-actions">
          {nextFilteredReview ? (
            <Link to={`/teacher/review/${nextFilteredReview.id}`} className="btn">
              Review Next
            </Link>
          ) : (
            <button className="btn btn--secondary" disabled>
              No Pending Review
            </button>
          )}
          <Link to="/teacher/create-question" className="btn btn--secondary">
            + Create Question
          </Link>
          <Link to="/teacher/analytics" className="btn btn--secondary">
            Open Analytics
          </Link>
          <button type="button" className="btn btn--secondary" onClick={() => refetch()}>
            Refresh Queue
          </button>
          <input
            className="teacher-action-search"
            placeholder="Filter by student/question/answer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="btn btn--secondary" onClick={() => setQuery("")}>
            Clear Search
          </button>
        </section>

        <section className="teacher-panel teacher-panel--queue" id="review-queue">
          <div className="teacher-panel-head">
            <h2>Pending Reviews</h2>
            <span className="badge badge--pending">{filteredQueue.length} pending</span>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="teacher-queue-empty">
              <div className="teacher-queue-empty-icon">✅</div>
              <h3>No pending reviews</h3>
              <p>All submissions are reviewed. New answers will appear here automatically.</p>
            </div>
          ) : (
            <div className="teacher-queue-list teacher-queue-list--cards">
              {filteredQueue.map((answer) => (
                <article key={answer.id} className="teacher-queue-item">
                  <div className="teacher-queue-item-top">
                    <div>
                      <h4>{answer.question_title}</h4>
                      <p>
                        {answer.student_username} · Answer #{answer.id}
                      </p>
                    </div>
                    <span className="score-badge score-badge--orange">
                      AI {answer.ai_score_percent ?? 0}%
                    </span>
                  </div>
                  <p className="teacher-queue-preview">
                    {answer.answer_text?.slice(0, 220)}
                    {answer.answer_text?.length > 220 ? "..." : ""}
                  </p>
                  <div className="teacher-queue-actions">
                    <Link to={`/teacher/review/${answer.id}`} className="btn">
                      Review
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
