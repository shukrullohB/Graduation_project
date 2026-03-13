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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Answers</h1>
          <p className="page-subtitle">Your submitted answers and scores</p>
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
              <h4>{answer.question_title}</h4>
              {answer.score != null ? (
                <ScoreBadge score={answer.score} />
              ) : (
                <span className="badge badge--pending">Awaiting review</span>
              )}
            </div>
            <div className="answer-result-card-body">
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
              <FeedbackBox feedback={answer.feedback} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
