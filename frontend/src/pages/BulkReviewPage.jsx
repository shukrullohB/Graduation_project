import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingAnswers, submitReview } from "../api/review.api";
import LoadingSpinner from "../components/LoadingSpinner";
import ScoreBadge from "../components/ScoreBadge";

const QUICK_PERCENT_PRESETS = [50, 65, 75, 85, 95];

export default function BulkReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reviewedIds, setReviewedIds] = useState(new Set());

  const { data: pending = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
    refetchOnWindowFocus: true,
  });

  const queue = useMemo(
    () => pending.filter((item) => !reviewedIds.has(item.id)),
    [pending, reviewedIds],
  );

  const total = queue.length;
  const current = queue[currentIndex] ?? null;

  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(total - 1);
    }
    if (total === 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, total]);

  useEffect(() => {
    if (!current) return;
    setScore("");
    setFeedback("");
    setError("");
  }, [current?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!current) return;
      if (event.target?.tagName === "TEXTAREA" || event.target?.tagName === "INPUT") {
        return;
      }

      if (event.key.toLowerCase() === "j") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
      if (event.key.toLowerCase() === "k") {
        setCurrentIndex((prev) => Math.min(prev + 1, Math.max(total - 1, 0)));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, total]);

  const maxScore = current?.question_max_score ?? 10;
  const scoreAsPercent =
    score === "" ? null : Math.round((Number(score) / maxScore) * 100);
  const progressPercent =
    pending.length === 0
      ? 0
      : Math.round(((pending.length - queue.length) / pending.length) * 100);

  const setPresetScore = (percent) => {
    const value = ((percent / 100) * maxScore).toFixed(1);
    setScore(String(Number(value)));
  };

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, total - 1));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!current) return;

    setSubmitting(true);
    setError("");
    try {
      await submitReview(current.id, { score: Number(score), feedback });
      setReviewedIds((prev) => new Set(prev).add(current.id));
      queryClient.invalidateQueries({ queryKey: ["pendingAnswers"] });
      await refetch();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading review queue..." />;

  if (!current) {
    return (
      <div className="bulk-review-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Bulk Review Queue</h1>
            <p className="page-subtitle">No pending submissions. Great work.</p>
          </div>
          <button className="btn btn--secondary" onClick={() => navigate("/teacher")}>
            Back to Dashboard
          </button>
        </div>
        <div className="bulk-review-empty">
          <div className="empty-state-icon">🎯</div>
          <p>Everything is reviewed. You are all caught up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bulk-review-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bulk Review Queue</h1>
          <p className="page-subtitle">
            Fast grading mode • Shortcuts: <kbd>J</kbd> previous, <kbd>K</kbd> next
          </p>
        </div>
        <button className="btn btn--secondary" onClick={() => navigate("/teacher")}>
          Exit Queue
        </button>
      </div>

      <div className="bulk-review-progress-card">
        <div className="bulk-review-progress-head">
          <span>
            Reviewing {currentIndex + 1} of {total}
          </span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="bulk-review-progress-track">
          <div
            className="bulk-review-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bulk-review-layout">
        <section className="bulk-review-main">
          <div className="bulk-review-card">
            <div className="bulk-review-meta">
              <span className="badge badge--pending">Pending</span>
              <span>{current.student_username}</span>
              <span>Answer #{current.id}</span>
            </div>
            <h3>{current.question_title}</h3>
            <p className="bulk-review-question-text">{current.question_description}</p>
            <div className="bulk-review-answer-block">{current.answer_text}</div>
          </div>

          <form className="bulk-review-form" onSubmit={handleSubmit}>
            <div className="bulk-review-form-head">
              <strong>Teacher Assessment</strong>
              <span>
                Range: 0 - {maxScore}
              </span>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <div className="form-group">
              <label className="form-label">Quick score presets</label>
              <div className="bulk-review-presets">
                {QUICK_PERCENT_PRESETS.map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    className="bulk-review-chip"
                    onClick={() => setPresetScore(percent)}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Score</label>
              <div className="score-input-row">
                <input
                  type="number"
                  min={0}
                  max={maxScore}
                  step="0.1"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
                {scoreAsPercent != null ? <ScoreBadge score={scoreAsPercent} /> : null}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Feedback</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write clear, actionable feedback..."
                required
              />
            </div>

            <div className="bulk-review-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={goNext}
                disabled={currentIndex >= total - 1}
              >
                Next
              </button>
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit & Continue"}
              </button>
            </div>
          </form>
        </section>

        <aside className="bulk-review-side">
          <div className="bulk-review-side-card">
            <h4>AI Suggestion</h4>
            {current.ai_score_percent != null ? (
              <>
                <div className="bulk-review-ai-score">
                  <ScoreBadge score={current.ai_score_percent} />
                </div>
                <p>{current.ai_feedback || "No AI feedback available."}</p>
              </>
            ) : (
              <p>AI score is unavailable for this answer.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
