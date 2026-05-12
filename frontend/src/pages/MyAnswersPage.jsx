import { useQuery } from "@tanstack/react-query";
import { getMyAnswers } from "../api/answers.api";
import ScoreBadge from "../components/ScoreBadge";
import FeedbackBox from "../components/FeedbackBox";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyAnswersPage() {
  const { data: answers, isLoading } = useQuery({
    queryKey: ["myAnswers"],
    queryFn: () => getMyAnswers().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner text="Loading your answers..." />;

  const totalAnswers = answers?.length ?? 0;
  const reviewedAnswers =
    answers?.filter((answer) => answer.score != null).length ?? 0;
  const pendingAnswers = totalAnswers - reviewedAnswers;

  return (
    <div className="page my-answers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Answers</h1>
          <p className="page-subtitle">Your submitted answers and scores</p>
        </div>
      </div>
      <div className="stats-grid my-answers-stats">
        <div className="stat-card stat-card--total-pop">
          <div className="submission-pop" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="16" width="30" height="34" rx="8" fill="#EAF2FF" />
              <rect x="20" y="24" width="18" height="3.5" rx="1.75" fill="#2A6BFF" />
              <rect x="20" y="31" width="14" height="3.5" rx="1.75" fill="#7EA6FF" />
              <rect x="20" y="38" width="11" height="3.5" rx="1.75" fill="#B4CBFF" />
            </svg>
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="24" y="12" width="26" height="30" rx="8" fill="#2A6BFF" />
              <rect x="30" y="20" width="12" height="3.5" rx="1.75" fill="#FFFFFF" />
              <rect x="30" y="27" width="9" height="3.5" rx="1.75" fill="#DCE8FF" />
            </svg>
          </div>
          <div className="stat-card-value">{totalAnswers}</div>
          <div className="stat-card-label">Total Submissions</div>
        </div>
        <div className="stat-card stat-card--reviewed-cubes">
          <div className="review-cubes" aria-hidden="true">
            <div className="review-cubes__floor" />
            <div className="review-cubes__stack review-cubes__stack--1">
              <span />
            </div>
            <div className="review-cubes__stack review-cubes__stack--2">
              <span />
            </div>
            <div className="review-cubes__stack review-cubes__stack--3">
              <span />
            </div>
            <div className="review-cubes__stack review-cubes__stack--4">
              <span />
            </div>
          </div>
          <div className="stat-card-value">{reviewedAnswers}</div>
          <div className="stat-card-label">Reviewed</div>
        </div>
        <div className="stat-card stat-card--pending-radar">
          <div className="pending-radar" aria-hidden="true">
            <span />
          </div>
          <div className="stat-card-value">{pendingAnswers}</div>
          <div className="stat-card-label">Pending</div>
        </div>
      </div>
      {answers?.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>You have not submitted any answers yet.</p>
        </div>
      )}
      <div className="answers-list">
        {answers?.map((answer) => (
          <div key={answer.id} className="answer-result-card">
            <div className="answer-result-card-header">
              <div className="answer-result-card-title-wrap">
                <h4>{answer.question_title}</h4>
                <span className="answer-result-id">Submission #{answer.id}</span>
              </div>
              <div className="answer-result-status">
                {answer.score != null ? (
                  <ScoreBadge score={answer.score} />
                ) : (
                  <span className="badge badge--pending">Awaiting review</span>
                )}
              </div>
            </div>
            <div className="answer-result-card-body">
              <div className="answer-result-section-title">Your response</div>
              <p className="answer-text">{answer.answer_text}</p>
              {answer.score != null && (
                <div className="scores-row">
                  <div className="score-item">
                    <span className="label">Teacher score:</span>
                    <ScoreBadge score={answer.score} />
                  </div>
                  {answer.ai_score != null && (
                    <div className="score-item">
                      <span className="label">AI score:</span>
                      <ScoreBadge score={answer.ai_score} />
                    </div>
                  )}
                </div>
              )}
              <div className="answer-result-section-title">Feedback</div>
              <FeedbackBox feedback={answer.feedback} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
