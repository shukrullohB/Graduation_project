import { useQuery } from "@tanstack/react-query";
import { getMyAnswers } from "../api/answers.api";
import ScoreBadge from "../components/ScoreBadge";
import FeedbackBox from "../components/FeedbackBox";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function MyAnswersPage() {
  const { user } = useAuth();

  const { data: answers, isLoading } = useQuery({
    queryKey: ["myAnswers", user?.id],
    queryFn: () => getMyAnswers().then((r) => r.data),
    enabled: Boolean(user?.id),
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
        <div className="stat-card">
          <div className="stat-card-icon blue">🗂</div>
          <div className="stat-card-value">{totalAnswers}</div>
          <div className="stat-card-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">✅</div>
          <div className="stat-card-value">{reviewedAnswers}</div>
          <div className="stat-card-label">Reviewed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange">⏳</div>
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
              {answer.teacher_feedback ? (
                <FeedbackBox feedback={`Teacher: ${answer.teacher_feedback}`} />
              ) : null}
              {answer.ai_feedback ? (
                <FeedbackBox feedback={`AI: ${answer.ai_feedback}`} />
              ) : null}
              {!answer.teacher_feedback && !answer.ai_feedback ? (
                <FeedbackBox feedback={null} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
