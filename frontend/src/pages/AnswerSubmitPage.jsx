import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../api/questions.api";
import { submitAnswer } from "../api/answers.api";

export default function AnswerSubmitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: question, isLoading } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id).then((r) => r.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitAnswer({ question_id: id, answer_text: answerText });
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const currentLength = answerText.trim().length;

  return (
    <div className="page answer-submit-page">
      <div className="page-header">
        <div>
          <h2>{question?.title}</h2>
          <p className="page-subtitle">Write your answer below</p>
        </div>
      </div>

      <div className="card answer-submit-card">
        <div className="review-box-label answer-submit-label">📖 Question</div>
        <p className="question-detail-text">
          {question?.description || question?.prompt}
        </p>
        <div className="answer-submit-meta">
          <span>Question ID: #{question?.id}</span>
          <span>Max score: {question?.max_score}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="answer-submit-form">
        {error && <p className="error-msg">{error}</p>}
        <div className="form-group">
          <label className="form-label">Your Answer</label>
          <textarea
            rows={8}
            placeholder="Write your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
          />
        </div>
        <div className="answer-submit-meta">
          <span>Characters: {currentLength}</span>
          <span>
            {currentLength < 40
              ? "Try adding more detail"
              : "Good detail level"}
          </span>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
