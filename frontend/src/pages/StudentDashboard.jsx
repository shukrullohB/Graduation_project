import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchQuestions } from "../api/questions.api";

const StudentDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Student</p>
          <h1>Questions</h1>
        </div>
      </div>
      {isLoading && <p className="muted">Loading questions…</p>}
      {isError && <p className="error">Could not load questions.</p>}
      <div className="grid">
        {data?.map((question) => (
          <div className="card" key={question.id}>
            <h3>{question.title}</h3>
            <p className="muted">{question.body?.slice(0, 120)}...</p>
            <div className="card__actions">
              <Link className="btn btn-ghost" to={`/questions/${question.id}`}>
                View
              </Link>
              <Link className="btn" to={`/questions/${question.id}/answer`}>
                Answer
              </Link>
            </div>
          </div>
        ))}
        {data?.length === 0 && !isLoading && (
          <p className="muted">No questions available yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
