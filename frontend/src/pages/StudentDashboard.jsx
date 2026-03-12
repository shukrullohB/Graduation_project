import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getQuestions } from "../api/questions.api";
import { getMyAnswers } from "../api/answers.api";
import ScoreBadge from "../components/ScoreBadge";

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

  if (qLoading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="question-list">
        {questions?.map((q) => (
          <div key={q.id} className="question-card">
            <h4>{q.title}</h4>
            <p>{q.description?.slice(0, 100)}...</p>
            <div className="question-card-footer">
              {answeredIds.has(q.id) ? (
                <span className="badge badge--done">Submitted</span>
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
