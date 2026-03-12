import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPendingAnswers } from "../api/review.api";
import ScoreBadge from "../components/ScoreBadge";

export default function TeacherDashboard() {
  const { data: pending, isLoading } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Teacher Dashboard</h2>
      <h3>Pending Reviews ({pending?.length ?? 0})</h3>
      <div className="answer-list">
        {pending?.map((answer) => (
          <div key={answer.id} className="answer-card">
            <p>
              <strong>{answer.student_username}</strong>
            </p>
            <p>{answer.question_title}</p>
            <p className="answer-preview">
              {answer.answer_text?.slice(0, 120)}...
            </p>
            <Link to={`/teacher/review/${answer.id}`} className="btn">
              Review
            </Link>
          </div>
        ))}
        {pending?.length === 0 && <p>No pending reviews.</p>}
      </div>
    </div>
  );
}
