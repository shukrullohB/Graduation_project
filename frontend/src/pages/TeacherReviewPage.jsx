import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPendingReviews, submitReview } from "../api/review.api";
import { queryClient } from "../app/queryClient";
import FeedbackBox from "../components/FeedbackBox";
import ScoreBadge from "../components/ScoreBadge";

const TeacherReviewPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingReviews"],
    queryFn: fetchPendingReviews,
  });

  const [drafts, setDrafts] = useState({});

  const initialDrafts = useMemo(() => {
    if (data) {
      const nextDrafts = {};
      data.forEach((item) => {
        nextDrafts[item.answer_id] = {
          score: item.ai_score ?? 0,
          feedback: item.ai_feedback ?? "",
        };
      });
      return nextDrafts;
    }
    return {};
  }, [data]);

  useEffect(() => {
    setDrafts(initialDrafts);
  }, [initialDrafts]);

  const reviewMutation = useMutation({
    mutationFn: ({ answerId, payload }) => submitReview(answerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingReviews"] });
    },
  });

  const handleFieldChange = (answerId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (answerId) => {
    const draft = drafts[answerId];
    if (!draft) return;
    reviewMutation.mutate({
      answerId,
      payload: {
        final_score: Number(draft.score),
        final_feedback: draft.feedback,
        approved: true,
      },
    });
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Pending Reviews</h1>
        </div>
      </div>

      {isLoading && <p className="muted">Loading pending answers…</p>}
      {isError && <p className="error">Could not load pending reviews.</p>}

      <div className="stack stack--lg">
        {data?.map((item) => (
          <div className="card" key={item.answer_id}>
            <div className="card__header">
              <div>
                <p className="eyebrow">Question</p>
                <h3>{item.question}</h3>
              </div>
              <div className="stack">
                <span className="muted">AI score</span>
                <ScoreBadge score={item.ai_score} />
              </div>
            </div>
            <div className="card__section">
              <p className="muted">Student Answer</p>
              <p>{item.student_answer}</p>
            </div>
            <FeedbackBox title="AI Feedback" text={item.ai_feedback} />
            <div className="form">
              <label className="form__field">
                <span>Final Score (0–5)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="5"
                  value={drafts[item.answer_id]?.score ?? ""}
                  onChange={(event) =>
                    handleFieldChange(
                      item.answer_id,
                      "score",
                      event.target.value,
                    )
                  }
                  required
                />
              </label>
              <label className="form__field">
                <span>Final Feedback</span>
                <textarea
                  rows={3}
                  value={drafts[item.answer_id]?.feedback ?? ""}
                  onChange={(event) =>
                    handleFieldChange(
                      item.answer_id,
                      "feedback",
                      event.target.value,
                    )
                  }
                  placeholder="Clarify or adjust the AI feedback before approving."
                />
              </label>
              {reviewMutation.error && (
                <p className="error">Failed to submit review.</p>
              )}
              <button
                className="btn"
                type="button"
                onClick={() => handleSubmit(item.answer_id)}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? "Submitting…" : "Approve & Save"}
              </button>
            </div>
          </div>
        ))}
        {data?.length === 0 && !isLoading && (
          <p className="muted">No pending reviews right now.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherReviewPage;
