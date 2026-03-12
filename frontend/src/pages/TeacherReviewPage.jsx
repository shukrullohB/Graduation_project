import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnswer } from "../api/answers.api";
import { submitReview } from "../api/review.api";
import FeedbackBox from "../components/FeedbackBox";
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
      <h2>Review Answer</h2>
      <div className="review-question">
        <h4>{answer?.question_title}</h4>
        <p>{answer?.question_description}</p>
      </div>
      <div className="review-answer">
        <h4>Student: {answer?.student_username}</h4>
        <p>{answer?.answer_text}</p>
      </div>
      {answer?.ai_score != null && (
        <div className="ai-suggestion">
          <strong>AI Suggested Score:</strong>{" "}
          <ScoreBadge score={answer.ai_score} />
          <FeedbackBox feedback={answer.ai_feedback} />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}
        <label>
          Score (0–100)
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </label>
        <label>
          Feedback
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write feedback for student..."
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
