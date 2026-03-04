import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../api/questions.api";
import { submitAnswer } from "../api/answers.api";
import FeedbackBox from "../components/FeedbackBox";
import ScoreBadge from "../components/ScoreBadge";

const AnswerSubmitPage = () => {
  const { id } = useParams();
  const [answerText, setAnswerText] = useState("");

  const { data: question, isLoading: loadingQuestion } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestionById(id),
    enabled: Boolean(id),
  });

  const {
    mutate,
    data: submission,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload) => submitAnswer(payload),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!answerText.trim()) return;
    mutate({ question_id: id, answer_text: answerText });
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Student</p>
          <h1>Submit Answer</h1>
        </div>
      </div>

      {loadingQuestion && <p className="muted">Loading question…</p>}
      {question && (
        <div className="card">
          <h3>{question.title}</h3>
          <p>{question.body}</p>
        </div>
      )}

      <form className="card form" onSubmit={handleSubmit}>
        <label className="form__field">
          <span>Your Answer</span>
          <textarea
            rows={6}
            value={answerText}
            onChange={(event) => setAnswerText(event.target.value)}
            placeholder="Write a concise response…"
            required
          />
        </label>
        {error && <p className="error">Failed to submit. Please try again.</p>}
        <button className="btn" type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit answer"}
        </button>
      </form>

      {submission && (
        <div className="card">
          <div className="card__header">
            <h3>AI Assessment</h3>
            {submission.ai_score !== undefined && (
              <ScoreBadge score={submission.ai_score} />
            )}
          </div>
          <FeedbackBox title="AI Feedback" text={submission.ai_feedback} />
          <p className="muted">Status: {submission.status ?? "pending"}</p>
        </div>
      )}
    </div>
  );
};

export default AnswerSubmitPage;
