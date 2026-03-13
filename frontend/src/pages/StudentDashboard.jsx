import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getQuestions } from "../api/questions.api";
import { getMyAnswers } from "../api/answers.api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function StudentDashboard() {
  const { data: questions, isLoading: qLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions().then((r) => r.data),
  });

  const { data: answers } = useQuery({
    queryKey: ["myAnswers"],
    queryFn: () => getMyAnswers().then((r) => r.data),
  });

  const answeredIds = new Set(answers?.map((a) => a.question_id));

  if (qLoading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Browse and answer questions below</p>
        </div>
      </div>
      <div className="list-grid">
        {questions?.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>No questions available yet.</p>
          </div>
        )}
        {questions?.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-card-body">
              <h4>{q.title}</h4>
              <p>
                {q.description?.slice(0, 110)}
                {q.description?.length > 110 ? "..." : ""}
              </p>
            </div>
            <div className="question-card-action">
              {answeredIds.has(q.id) ? (
                <span className="badge badge--done">✓ Submitted</span>
              ) : (
                <Link to={`/student/submit/${q.id}`} className="btn">
                  Answer
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
