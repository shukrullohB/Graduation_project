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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{question?.title}</h2>
          <p className="page-subtitle">Write your answer below</p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="review-box-label" style={{ marginBottom: "0.5rem" }}>
          📖 Question
        </div>
        <p style={{ color: "var(--gray-700)", lineHeight: "1.7" }}>
          {question?.description}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
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
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
