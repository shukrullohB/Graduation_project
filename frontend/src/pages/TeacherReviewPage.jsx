import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnswer } from "../api/answers.api";
import { submitReview } from "../api/review.api";
import ScoreBadge from "../components/ScoreBadge";

export default function TeacherReviewPage() {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: answer, isLoading } = useQuery({
    queryKey: ["answer", answerId],
    queryFn: () => getAnswer(answerId).then((r) => r.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitReview(answerId, { score: Number(score), feedback });
      qc.invalidateQueries({ queryKey: ["pendingAnswers"] });
      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.detail || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Review Answer</h2>
          <p className="page-subtitle">
            Student: <strong>{answer?.student_username}</strong>
          </p>
        </div>
        <button
          className="btn btn--secondary"
          onClick={() => navigate("/teacher")}
        >
          ← Back
        </button>
      </div>

      <div className="review-grid">
        <div className="review-box">
          <div className="review-box-label">📖 Question</div>
          <p>
            <strong>{answer?.question_title}</strong>
          </p>
          {answer?.question_description && (
            <p style={{ marginTop: "0.5rem" }}>{answer.question_description}</p>
          )}
        </div>
        <div className="review-box">
          <div className="review-box-label">✍️ Student Answer</div>
          <p>{answer?.answer_text}</p>
        </div>
      </div>

      {answer?.ai_score != null && (
        <div className="ai-suggestion">
          <div className="ai-suggestion-icon">🤖</div>
          <div className="ai-suggestion-body">
            <strong>
              AI Suggested Score: <ScoreBadge score={answer.ai_score} />
            </strong>
            <p>{answer.ai_feedback || "No AI feedback available."}</p>
          </div>
        </div>
      )}

      <div className="review-form">
        <div className="review-form-title">Your Review</div>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="form-group">
            <label className="form-label">Score (0–100)</label>
            <div className="score-input-row">
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
              {score !== "" && <ScoreBadge score={Number(score)} />}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Feedback</label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write constructive feedback for the student..."
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate("/teacher")}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
