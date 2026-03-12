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
      <h2>My Answers</h2>
      {answers?.length === 0 && <p>You have not submitted any answers yet.</p>}
      <div className="answers-list">
        {answers?.map((answer) => (
          <div key={answer.id} className="answer-result-card">
            <h4>{answer.question_title}</h4>
            <p className="answer-text">{answer.answer_text}</p>
            <div className="answer-result-footer">
              {answer.score != null ? (
                <>
                  <div>
                    <span className="label">Score: </span>
                    <ScoreBadge score={answer.score} />
                  </div>
                  <div>
                    <span className="label">AI Score: </span>
                    <ScoreBadge score={answer.ai_score} />
                  </div>
                  <FeedbackBox feedback={answer.feedback} />
                </>
              ) : (
                <span className="badge badge--pending">Awaiting review</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
