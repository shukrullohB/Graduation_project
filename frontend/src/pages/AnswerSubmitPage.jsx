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
      <h2>{question?.title}</h2>
      <p>{question?.description}</p>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}
        <textarea
          rows={8}
          placeholder="Write your answer here..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </form>
    </div>
  );
}
