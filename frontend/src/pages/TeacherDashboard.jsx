import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPendingAnswers } from "../api/review.api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TeacherDashboard() {
  const { data: pending, isLoading } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Dashboard</h1>
          <p className="page-subtitle">Answers awaiting your review</p>
        </div>
        <span className="badge badge--pending">
          {pending?.length ?? 0} pending
        </span>
      </div>
      <div className="list-grid">
        {pending?.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <p>All caught up — no pending reviews.</p>
          </div>
        )}
        {pending?.map((answer) => (
          <div key={answer.id} className="answer-card">
            <div className="answer-card-meta">
              <span className="badge badge--pending">Pending</span>
              <span>{answer.student_username}</span>
            </div>
            <div className="answer-card-title">{answer.question_title}</div>
            <p className="answer-preview">
              {answer.answer_text?.slice(0, 140)}
              {answer.answer_text?.length > 140 ? "..." : ""}
            </p>
            <div className="answer-card-footer">
              <span />
              <Link to={`/teacher/review/${answer.id}`} className="btn">
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
